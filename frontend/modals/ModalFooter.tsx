import Button from '../components/button';
import styles from '../styles/Modal.module.scss';

export const ModalFooter: React.FC<{
    confirmLabel: string;
    onConfirm: () => void;
    cancelLabel: string;
    onCancel: () => void;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
}> = ({ confirmLabel, onConfirm, cancelLabel, onCancel, confirmDisabled=false, cancelDisabled=false }) => {
    return(
        <div className={styles['footer']}>
            <Button 
                onClick={onCancel}
                type={'transparent'}
                disabled={cancelDisabled}
            >
                {cancelLabel}
            </Button>
            <Button
                onClick={onConfirm}
                disabled={confirmDisabled}
            >
                {confirmLabel}
            </Button>
        </div>
    )
}