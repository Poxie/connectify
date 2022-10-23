import styles from './SelectUserModal.module.scss';
import { useEffect, useState } from "react"
import { Input } from "../../components/input"
import { useAuth } from "../../contexts/auth/AuthProvider"
import { User } from "../../types"
import { ModalHeader } from "../ModalHeader"
import { SelectUserItem } from "./SelectUserItem"
import Image from 'next/image';
import { useModal } from '../../contexts/modal/ModalProvider';
import { SelectUserConfirmationModal } from './SelectUserConfirmationModal';
import { useRouter } from 'next/router';
import { useSocket } from '../../contexts/socket/SocketProvider';
import { useAppSelector } from '../../redux/store';
import { selectChannelIds } from '../../redux/messages/hooks';
import { SelectUserChannel } from './SelectUserChannel';
import { useDispatch } from 'react-redux';
import { addChannel } from '../../redux/messages/actions';
import { useTranslation } from 'next-i18next';

export const SelectUserModal = () => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const { get, post, profile } = useAuth();
    const { pushModal, close } = useModal();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<User[]>([]);
    const channelIds = useAppSelector(selectChannelIds);

    // Fetching results on query change
    useEffect(() => {
        if(!query) {
            setLoading(false);
            return setResults([]);
        }
        setLoading(true);

        // Fetching users
        get(`/users/search?query=${query}`)
            .then((users: User[]) => {
                // Making sure logged in user is not present
                const filteredUsers = users.filter(user => user.id !== profile?.id);
                setResults(filteredUsers);
                setLoading(false);
            })
    }, [query]);

    // Selecting user
    const onSelect = (user: User) => {
        pushModal(
            <SelectUserConfirmationModal 
                user={user}
                channelIds={channelIds}
            />
        );
    }

    return(
        <div className={styles['container']}>
            <ModalHeader>
                {t('selectUserHeader')}
            </ModalHeader>
            <Input 
                onChange={setQuery}
                placeholder={t('searchForUser')}
                containerClassName={styles['search-input']}
            />
            {!query && (
                <>
                <span className={styles['label']}>
                    {t('currentDirectMessages')}
                </span>

                {!channelIds.length && (
                    <span style={{paddingLeft: `var(--spacing-primary)`}}>
                        {t('emptyCurrentDirectMessages')}
                    </span>
                )}
                {channelIds.length !== 0 && (
                    <ul className={styles['items']}>
                        {channelIds.map(channelId => (
                            <SelectUserChannel 
                                id={channelId}
                                key={channelId} 
                            />
                        ))}
                    </ul>
                )}
                </>
            )}
            {query && !loading && results.length === 0 && (
                <span className={styles['label']}>
                    {t('noResults')}
                </span>
            )}
            {results.length !== 0 && (
                <>
                <span className={styles['label']}>
                    {t('showingResults', { amount: results.length })}
                </span>
                <ul className={styles['items']}>
                    {results.map(user => (
                        <SelectUserItem 
                            user={user}
                            onSelect={onSelect}
                            key={user.id}
                        />
                    ))}
                </ul>
                </>
            )}
        </div>
    )
}