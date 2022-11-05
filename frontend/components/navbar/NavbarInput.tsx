import styles from '../../styles/Navbar.module.scss';
import React, { RefObject, useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { User } from "../../types";
import { Input } from "../input"
import { SearchResult } from './SearchResult';
import { Loader } from '../loader';
import { useTranslation } from 'next-i18next';

export const NavbarInput = React.forwardRef<HTMLDivElement>((props, ref) => {
    const { t } = useTranslation('common');
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
        get<User[]>(`/users/search?query=${query}`)
            .then(users => {
                setResults(users);
                setLoading(false);
            })
    }, [query, authLoading]);

    // Closing results on blur
    const handleBlur = () => {
        setTimeout(() => {
            setResultsShowing(false);
            (ref as RefObject<HTMLDivElement>)?.current?.classList.remove(styles['active']);
        }, 150);
    }

    // Closing input on smaller devices
    const onBackdropClick = () => {
        (ref as RefObject<HTMLDivElement>)?.current?.classList.toggle(styles['active']);
    }

    return(
        <div className={styles['input-container']} ref={ref}>
            <div 
                className={styles['backdrop']}
                onClick={onBackdropClick}
            />
            <Input 
                onFocus={() => setResultsShowing(true)}
                onBlur={handleBlur}
                placeholder={t('searchForUser')}
                onChange={setQuery}
                inputClassName={styles['input']}
            />
            {query && resultsShowing && (
                <div className={styles['results']}>
                    {!results.length && loading && (
                        <div className={styles['loader']} aria-label="Loading">
                            <Loader />
                        </div>
                    )}

                    {!results.length && !loading && (
                        <span>
                            {t('noResults')}
                        </span>
                    )}

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
});