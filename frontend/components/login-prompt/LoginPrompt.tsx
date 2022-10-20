import styles from './LoginPrompt.module.scss';
import { ReactElement } from "react";
import { useTranslation } from 'next-i18next';
import { LoginModal } from '../../modals/login/LoginModal';
import Button from '../button';
import { useModal } from '../../contexts/modal/ModalProvider';

export const LoginPrompt = () => {
    const { t } = useTranslation('common');
    const { setModal } = useModal();

    return(
        <div className={styles['container']}>
            <h2>
                {t('notLoggedInHeader')}
            </h2>
            <span>
                {t('notLoggedInMessage')}
            </span>
            
            <div className={styles['buttons']}>
                <Button onClick={() => {
                    setModal(<LoginModal />)
                }}>
                    {t('signIn')}
                </Button>
            </div>
        </div>
    )
}