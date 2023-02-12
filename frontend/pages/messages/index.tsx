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
import Head from 'next/head';
import { GetServerSideProps } from 'next';

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
    
    const title = t('title') + ` - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`;
    return(
        <>
        <Head>
            <title>
                {title}
            </title>
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/messages`} />
        </Head>

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
        </>
    )
}

Messages.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'messages']))
    }
})

export default Messages;