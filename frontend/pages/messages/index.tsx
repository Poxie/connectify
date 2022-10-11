import styles from '../../styles/Messages.module.scss';
import { ReactElement } from "react";
import { MessagesLayout } from "../../layouts/messages/MessagesLayout";
import { NextPageWithLayout } from "../_app";
import Button from '../../components/button';
import { useModal } from '../../contexts/modal/ModalProvider';
import { SelectUserModal } from '../../modals/select-user/SelectUserModal';

const Messages: NextPageWithLayout = () => {
    const { setModal } = useModal();

    const openModal = () => {
        setModal(<SelectUserModal />);
    }
    
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