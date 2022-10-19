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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Messages: NextPageWithLayout = () => {
    const { t } = useTranslation('messages');
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
                {t('chooseDirectMessage.header')}
            </h2>
            <span>
                {t('chooseDirectMessage.message')}
            </span>
            <Button 
                className={styles['conversation-button']}
                onClick={openModal}
            >
                {t('startConversation')}
            </Button>
        </div>
    )
}

Messages.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'messages']))
    }
})

export default Messages;