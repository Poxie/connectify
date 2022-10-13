import styles from '../../styles/Messages.module.scss';
import { ReactElement, useEffect } from "react";
import { MessagesLayout } from "../../layouts/messages/MessagesLayout";
import { NextPageWithLayout } from "../_app";
import Button from '../../components/button';
import { useModal } from '../../contexts/modal/ModalProvider';
import { SelectUserModal } from '../../modals/select-user/SelectUserModal';
import { useDispatch } from 'react-redux';
import { setLastChannelId } from '../../redux/messages/actions';
import { useScreenType } from '../../hooks/useScreenType';

const Messages: NextPageWithLayout = () => {
    const { setModal } = useModal();
    const dispatch = useDispatch();
    const screenType = useScreenType();

    // Resetting last channelId
    useEffect(() => {
        dispatch(setLastChannelId(null));
    }, []);

    // Opening conversation modal
    const openModal = () => {
        setModal(<SelectUserModal />);
    }

    // Hiding at small screens
    if(['small', 'medium'].includes(screenType)) return null;
    
    return(
        <div className={styles['empty']}>
            <h2>
                Choose a direct message
            </h2>
            <span>
                Choose an existing direct message or create a new one.
            </span>
            <Button 
                className={styles['conversation-button']}
                onClick={openModal}
            >
                Start conversation
            </Button>
        </div>
    )
}

Messages.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export default Messages;