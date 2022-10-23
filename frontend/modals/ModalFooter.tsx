import Button from '../components/button';
import { Loader } from '../components/loader';
import styles from '../styles/Modal.module.scss';

export const ModalFooter: React.FC<{
    confirmLabel: string;
    onConfirm: () => void;
    cancelLabel: string;
    onCancel: () => void;
    confirmLoading?: boolean;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
}> = ({ confirmLabel, onConfirm, cancelLabel, onCancel, confirmLoading=false, confirmDisabled=false, cancelDisabled=false }) => {
    const className = [
        confirmLoading ? styles['loading'] : ''
    ].join(' ');
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
                disabled={confirmDisabled || confirmLoading}
                className={className}
            >
                {!confirmLoading ? confirmLabel : <Loader />}
            </Button>
        </div>
    )
}