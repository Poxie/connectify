import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AddIcon } from '../../assets/icons/AddIcon';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import styles from './PostOverlay.module.scss';

export const CloseOverlay: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { close } = useOverlay();

    const onClick = () => {
        router.replace(`/posts/${postId}`, undefined, { shallow: true });
        close();
    }
    
    return(
        <button 
            className={styles['close']}
            onClick={onClick}
            aria-label={t('close')}
        >
            <AddIcon />
        </button>
    )
}