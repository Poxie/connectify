import Button from '../components/button';
import styles from '../styles/Modal.module.scss';

export const ModalFooter: React.FC<{
    confirmLabel: string;
    onConfirm: () => void;
    cancelLabel: string;
    onCancel: () => void;
    disabled?: boolean;
}> = ({ confirmLabel, onConfirm, cancelLabel, onCancel, disabled=false }) => {
    return(
        <div className={styles['footer']}>
            <Button 
                onClick={onCancel}
                type={'transparent'}
                disabled={disabled}
            >
                {cancelLabel}
            </Button>
            <Button
                onClick={onConfirm}
                disabled={disabled}
            >
                {confirmLabel}
            </Button>
        </div>
    )
}