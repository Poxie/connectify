import React, { useCallback, useEffect, useState } from 'react';
import { AuthContext as AuthContextType } from './types';

const AuthContext = React.createContext({} as AuthContextType);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [profile, setProfile] = useState(null);
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

        get('/me')
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
    const get = useCallback(async (query: string) => {
        return(
            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(async res => {
                // If request successful, return json data
                if(res.ok) {
                    return res.json();
                }
                // Else throw error
                throw new Error(await res.text());
            })
            .then(data => data)
        )
    }, [token]);

    // Function to post data to API with user authentication.
    const post = useCallback(async (query: string, body?: Object) => {
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
                throw new Error(await res.text())
            })
            .then(data => data)
        )
    }, [token]);

    // Function to delete data through the API with user authentication.
    const destroy = useCallback(async (query: string) => {
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
                throw new Error(await res.text())
            })
        )
    }, [token]);

    const value = {
        get,
        post,
        destroy,
        loading,
        profile
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}