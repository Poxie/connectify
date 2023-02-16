import { useAuth } from '../../../contexts/auth/AuthProvider';
import { useModal } from '../../../contexts/modal/ModalProvider';
import { useToast } from '../../../contexts/toast/ToastProvider';
import { ConfirmModal } from '../../../modals/confirm/ConfirmModal';
import styles from '../../../styles/Account.module.scss';

export const DeleteAccount = () => {
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
                header={'Delete account?'}
                subHeader={'Are you sure you want to delete your account? This action cannot be undone once performed, be careful.'}
                confirmLabel={'Delete account'}
            />
        )
    }

    return(
        <>
            <p>
                If you no longer want your account you can delete it here. Note, however, that this cannot be undone once your account has been deleted.
            </p>
            <button 
                className={styles['delete-button']}
                onClick={openConfirmModal}
            >
                Delete Account
            </button>
        </>
    )
}