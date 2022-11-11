import styles from '../../styles/Navbar.module.scss';
import React, { RefObject, useEffect, useRef, useState } from "react";
import { User } from "../../types";
import { Input } from "../input"
import { useTranslation } from 'next-i18next';
import { useLiveFetching } from '../../hooks/useLiveFetching';
import { NavbarResults } from './NavbarResults';

const DELAY_UNTIL_REQUEST = 300;
export const NavbarInput: React.FC<{
    inputRef: RefObject<HTMLInputElement>;
}> = ({ inputRef }) => {
    const { t } = useTranslation('common');
    const [query, setQuery] = useState('');
    const [shouldFetch, setShouldFetch] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const closeTimeout = useRef<NodeJS.Timeout | null>(null);
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

    // Opening/closing input on focus/blur
    const onBlur = () => {
        closeTimeout.current = setTimeout(() => {
            setResultsShowing(false);
            inputRef.current?.blur();
            closeTimeout.current = null;
        }, 150);
    }
    const onFocus = () => {
        if(closeTimeout.current) clearTimeout(closeTimeout.current);
        setResultsShowing(true);
    }

    const className =[
        styles['input-container'],
        resultsShowing ? styles['active'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <div 
                className={styles['backdrop']}
            />
            <Input 
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={t('searchForUser')}
                onChange={onChange}
                inputClassName={styles['input']}
                ref={inputRef}
                extraAttributes={[['data-search-input', 'true']]}
            />
            {query && resultsShowing && (
                <NavbarResults 
                    data={data}
                    loading={loading}
                    onFocus={onFocus}
                    onClick={onBlur}
                    onBlur={onBlur}
                />
            )}
        </div>
    )
}