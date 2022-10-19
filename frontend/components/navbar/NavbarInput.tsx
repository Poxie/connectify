import styles from '../../styles/Navbar.module.scss';
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { User } from "../../types";
import { Input } from "../input"
import { SearchResult } from './SearchResult';

export const NavbarInput = () => {
    const { get, loading: authLoading } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [resultsShowing, setResultsShowing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetching users on query change
    useEffect(() => {
        if(authLoading) return;

        // Preventing empty requests
        if(!query) {
            setLoading(false);
            setResults([]);
            return;
        }

        setLoading(true);

        // Executing fetch request
        get(`/users/search?query=${query}`)
            .then(users => {
                setResults(users);
                setLoading(false);
            })
    }, [query, authLoading]);

    // Closing results on blur
    const handleBlur = () => {
        setTimeout(() => {
            setResultsShowing(false);
        }, 150);
    }

    return(
        <div className={styles['input-container']}>
            <Input 
                onFocus={() => setResultsShowing(true)}
                onBlur={handleBlur}
                placeholder={'Search for user'}
                onChange={setQuery}
            />
            {query && resultsShowing && (
                <div className={styles['results']}>
                    {results.map(user => (
                        <SearchResult 
                            {...user}
                            key={user.id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}