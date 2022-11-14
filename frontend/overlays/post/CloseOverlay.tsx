import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AddIcon } from '../../assets/icons/AddIcon';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import { useQueryId } from '../../hooks/useQueryId';
import styles from './PostOverlay.module.scss';

export const CloseOverlay = () => {
    const { t } = useTranslation('common');
    const { close } = useOverlay();
    const router = useRouter();
    const postId = useQueryId('postId');

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