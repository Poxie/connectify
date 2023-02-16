import { useTranslation } from 'next-i18next';
import { useAuth } from '../../../contexts/auth/AuthProvider';
import { useModal } from '../../../contexts/modal/ModalProvider';
import { useToast } from '../../../contexts/toast/ToastProvider';
import { ConfirmModal } from '../../../modals/confirm/ConfirmModal';
import styles from '../../../styles/Account.module.scss';

export const DeleteAccount = () => {
    const { t } = useTranslation('settings');
    const { setModal, close } = useModal();
    const { destroy, profile } = useAuth();
    const { setToast } = useToast();
    
    const onConfirm = async () => {
        if(!profile) return;
        
        destroy(`/users/${profile.id}`)
            .then(() => {
                window.localStorage.token = '';
                window.location.reload();
            })
            .catch(error => {
                setToast('Something went wrong deleting account.');
            })
    }
    const openConfirmModal = () => {
        setModal(
            <ConfirmModal 
                onCancel={close}
                onConfirm={onConfirm} 
                header={t('account.deleteModalHeader')}
                subHeader={t('account.deleteModalSubHeader')}
                confirmLabel={t('account.deleteModalConfirm')}
            />
        )
    }

    return(
        <>
            <p>
                {t('account.deleteAccountDescription')}
            </p>
            <button 
                className={styles['delete-button']}
                onClick={openConfirmModal}
            >
                {t('account.deleteAccountButton')}
            </button>
        </>
    )
}