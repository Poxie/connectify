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

export const SelectUserModal = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { get, post, profile } = useAuth();
    const { socket } = useSocket();
    const { pushModal, close } = useModal();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const channelIds = useAppSelector(selectChannelIds);

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
        post(`/users/@me/channels`, {
            recipient_id: user.id
        })
            .then(channel => {
                // If channel was created, add to redux
                if(!channelIds.includes(channel.id)) {
                    dispatch(addChannel(channel));
                    
                    // Sending channel creation event to recipient
                    socket?.emit('DM_CHANNEL_CREATED', ({
                        recipient_id: user.id,
                        channel_id: channel.id
                    }));
                }

                router.push(`/messages/${channel.id}`);
                close();
            })
    }

    return(
        <div className={styles['container']}>
            <ModalHeader>
                Select User
            </ModalHeader>
            <Input 
                onChange={setQuery}
                placeholder={'Search for user...'}
                containerClassName={styles['search-input']}
            />
            {!results.length && (
                <>
                <span className={styles['label']}>
                    Current direct messages
                </span>
                <ul className={styles['items']}>
                    {channelIds.map(channelId => (
                        <SelectUserChannel 
                            id={channelId}
                            key={channelId} 
                        />
                    ))}
                </ul>
                </>
            )}
            {results.length !== 0 && (
                <>
                <span className={styles['label']}>
                    Showing {results.length} results
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