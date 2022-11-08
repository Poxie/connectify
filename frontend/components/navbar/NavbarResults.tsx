import { useTranslation } from 'next-i18next';
import styles from '../../styles/Navbar.module.scss';
import { User } from "../../types"
import { Loader } from '../loader';
import { SearchResult } from './SearchResult';

export const NavbarResults: React.FC<{
    data: User[] | null;
    loading: boolean;
    onFocus: () => void;
    onClick: () => void;
    onBlur: () => void;
}> = ({ data, loading, onFocus, onBlur, onClick }) => {
    const { t } = useTranslation('common');
    return(
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
                    onFocus={onFocus}
                    onClick={onClick}
                    onBlur={onBlur}
                    key={user.id}
                />
            ))}
        </div>
    )
}