import React, { useCallback, useEffect, useState } from 'react';
import { User } from '../../types';
import { AuthContext as AuthContextType, ExtendedError } from './types';

const AuthContext = React.createContext({} as AuthContextType);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [profile, setProfile] = useState<User | null>(null);
    const [token, setToken] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);

    // Checking if user is logged in on render
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            setToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    // Setting profile on render
    useEffect(() => {
        if(!token) return;

        get<User>('/me')
            .then(user => {
                setProfile(user);
            })
            .catch(error => {
                console.log(error.message);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [token]);

    // Function to fetch data from API with user authentication.
    const get = useCallback(async function<T>(query: string, signal?: AbortSignal) {
        return(
            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                signal
            })
            .then(async res => {
                // If request successful, return json data
                if(res.ok) {
                    return res.json();
                }
                // Else throw error
                throw new Error(await res.text());
            })
            .then((data: T) => data)
        )
    }, [token]);

    // Function to post data to API with user authentication.
    const post = useCallback(async function<T>(query: string, body?: Object) {
        const formData = new FormData();
        Object.entries(body || {}).forEach(([key, value]) => {
            formData.append(key, value);
        })

        return(
            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            .then(async res => {
                // If request successful, return json data
                if(res.ok) {
                    return res.json()
                }
                // Else throw error
                const error = new Error(await res.text()) as ExtendedError;
                error.code = res.status;
                throw error;
            })
            .then((data: T) => data)
        )
    }, [token]);

    // Function to delete data through the API with user authentication.
    const destroy = useCallback(async function<T>(query: string) {
        return(
            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(async res => {
                // If request is sucessful, return json data
                if(res.ok) {
                    return res.json()
                }
                // Else throw error
                const error = new Error(await res.text()) as ExtendedError;
                error.code = res.status;
                throw error;
            })
            .then((data: T) => data)
        )
    }, [token]);

    // Function to patch data on the API with user authentication.
    const patch = useCallback(async function<T>(query: string, body?: Object) {
        const formData = new FormData();
        Object.entries(body || {}).forEach(([key, value]) => {
            formData.append(key, value);
        })

        return(
            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            .then(async res => {
                // If request successful, return json data
                if(res.ok) {
                    return res.json()
                }
                // Else throw error
                const error = new Error(await res.text()) as ExtendedError;
                error.code = res.status;
                throw error;
            })
            .then((data: T) => data)
        )
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