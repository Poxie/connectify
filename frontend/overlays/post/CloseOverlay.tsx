import { AddIcon } from '../../assets/icons/AddIcon';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import styles from './PostOverlay.module.scss';

export const CloseOverlay = () => {
    const { close } = useOverlay();
    
    return(
        <button 
            className={styles['close']}
            onClick={close}
        >
            <AddIcon />
        </button>
    )
}