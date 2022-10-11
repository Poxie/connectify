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

export const SelectUserModal = () => {
    const router = useRouter();
    const { get, post, profile } = useAuth();
    const { socket } = useSocket();
    const { pushModal, close } = useModal();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);

    // Fetching results on query change
    useEffect(() => {
        if(!query) return setResults([]);

        // Fetching users
        get(`/users/search?query=${query}`)
            .then((users: User[]) => {
                // Making sure logged in user is not present
                const filteredUsers = users.filter(user => user.id !== profile?.id);
                setResults(filteredUsers);
            })
    }, [query]);

    // Selecting user
    const onSelect = (user: User) => {
        pushModal(
            <SelectUserConfirmationModal 
                user={user}
                onConfirm={() => onConfirm(user)}
            />
        );
    }

    // Confirming selection
    const onConfirm = (user: User) => {
        post(`/users/@me/channels/`, {
            recipient_id: user.id
        })
            .then(channel => {
                router.push(`/messages/${channel.id}`);
                close();
            })
    }

    return(
        <>
            <ModalHeader>
                Select User
            </ModalHeader>
            <Input 
                onChange={setQuery}
                placeholder={'Search for user...'}
            />
            {results.length === 0 && (
                <span className={styles['empty-query']}>
                    Insert query to search for a user.
                </span>
            )}
            {results.length !== 0 && (
                <ul className={styles['items']}>
                    {results.map(user => (
                        <SelectUserItem 
                            user={user}
                            onSelect={onSelect}
                            key={user.id}
                        />
                    ))}
                </ul>
            )}
        </>
    )
}