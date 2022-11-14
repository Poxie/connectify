import { useTranslation } from 'next-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { User } from '../../types';
import { AuthContext as AuthContextType, ExtendedError, RequestMethod } from './types';

const AuthContext = React.createContext({} as AuthContextType);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const { t } = useTranslation('common');
    const [profile, setProfile] = useState<User | null>(null);
    const [token, setToken] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);

    // Setting user token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return setLoading(false);
        setToken(token);
    }, []);

    // Fetching user profile
    useEffect(() => {
        if(!token) return;

        get<User>('/me')
            .then(user => {
                setProfile(user);
                setLoading(false);
            })
    }, [token]);
    
    // Function to throw error
    const throwError = useCallback((message: string, code: number) => {
        const error = new Error(message) as ExtendedError;
        error.code = code;
        throw error;
    }, []);

    // Function to make http request
    const makeRequest = useCallback(async function<T>(query: string, method: RequestMethod, body?: Object, signal?: AbortSignal) {
        const formData = new FormData();
        Object.entries(body || {}).forEach(([key, value]) => {
            if(Array.isArray(value)) {
                value.forEach(v => formData.append(key, v));
                return;
            }
            formData.append(key, value);
        })

        return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: method !== 'GET' ? formData : undefined,
            signal
        })
        .then(async data => {
            // Internal error
            if(data.status === 500) {
                throwError(t('internalError'), data.status);
            }

            // Fetch failed for other reason
            if(!data.ok) {
                throwError(await data.text(), data.status);
            }

            // Request is successful
            return await data.json() as T;
        })
    }, [token]);

    // Function to fetch data from API with user authentication.
    const get = useCallback(async function<T>(query: string, signal?: AbortSignal) {
        return makeRequest<T>(query, 'GET', {}, signal);
    }, [token]);

    // Function to post data to API with user authentication.
    const post = useCallback(async function<T>(query: string, body?: Object) {
        return makeRequest<T>(query, 'POST', body);
    }, [token]);

    // Function to delete data through the API with user authentication.
    const destroy = useCallback(async function<T>(query: string) {
        return makeRequest<T>(query, 'DELETE');
    }, [token]);

    // Function to patch data on the API with user authentication.
    const patch = useCallback(async function<T>(query: string, body?: Object) {
        return makeRequest<T>(query, 'PATCH', body);
    }, [token]);

    const value = {
        get,
        post,
        patch,
        destroy,
        token,
        loading,
        profile,
        setProfile
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}