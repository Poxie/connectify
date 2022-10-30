import styles from './SelectUserModal.module.scss';
import Image from "next/image";
import { useModal } from "../../contexts/modal/ModalProvider";
import { Channel, User } from "../../types"
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader";
import { SelectedUser } from './SelectedUser';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useDispatch } from 'react-redux';
import { addChannel } from '../../redux/messages/actions';
import { useSocket } from '../../contexts/socket/SocketProvider';
import { useState } from 'react';

export const SelectUserConfirmationModal: React.FC<{
    user: User;
    channelIds: number[];
}> = ({ user, channelIds }) => {
    const { t } = useTranslation('common');
    const { goBack, close } = useModal();
    const { post } = useAuth();
    const { socket } = useSocket();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Confirming selection
    const onConfirm = async (user: User) => {
        setLoading(true);

        const channel = await post<Channel>(`/users/@me/channels`, {
            recipient_id: user.id
        }).catch(error => {
            setLoading(false);
        })

        if(!channel) return;
        
        // If channel was created, add to redux
        if(!channelIds.includes(channel.id)) {
            dispatch(addChannel(channel));
            
            // Sending channel creation event to recipient
            socket?.emit('dm_channel_created', ({
                recipient_id: user.id,
                channel_id: channel.id
            }));
        }

        await router.push(`/messages/${channel.id}`);
        close();
    }

    if(!user) return null;

    return(
        <>
        <ModalHeader>
            {t('createConversationWith')} {user.display_name || user.username}?
        </ModalHeader>

        <SelectedUser 
            user={user} 
            cancel={goBack} 
        />

        <ModalFooter 
            cancelLabel={t('goBack')}
            onCancel={goBack}
            confirmLabel={t('create')}
            onConfirm={() => onConfirm(user)}
            confirmLoading={loading}
        />
        </>
    )
}