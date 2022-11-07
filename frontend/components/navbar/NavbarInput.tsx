import styles from '../../styles/Navbar.module.scss';
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { User } from "../../types";
import { Input } from "../input"
import { SearchResult } from './SearchResult';
import { Loader } from '../loader';
import { useTranslation } from 'next-i18next';
import { useLiveFetching } from '../../hooks/useLiveFetching';

const DELAY_UNTIL_REQUEST = 300;
export const NavbarInput = React.forwardRef<HTMLDivElement>((props, ref) => {
    const { t } = useTranslation('common');
    const [query, setQuery] = useState('');
    const [shouldFetch, setShouldFetch] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const [resultsShowing, setResultsShowing] = useState(false);
    const { loading, data } = useLiveFetching<User[]>(query ? `/users/search?query=${query}` : '', shouldFetch);

    // Handling input text change
    const onChange = (text: string) => {
        setQuery(text);

        // Preventing spam requests
        if(timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            setShouldFetch(true);
            setTimeout(() => {
                setShouldFetch(false);
            });
        }, DELAY_UNTIL_REQUEST);
    }

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
                onChange={onChange}
                inputClassName={styles['input']}
            />
            {query && resultsShowing && (
                <div className={styles['results']}>
                    {!data?.length && loading && (
                        <div className={styles['loader']} aria-label="Loading">
                            <Loader />
                        </div>
                    )}

                    {typeof data === 'object' && !data?.length && !loading && (
                        <span>
                            {t('noResults')}
                        </span>
                    )}

                    {data?.map(user => (
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