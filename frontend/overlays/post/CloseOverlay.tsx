import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AddIcon } from '../../assets/icons/AddIcon';
import styles from './PostOverlay.module.scss';

export const CloseOverlay = () => {
    const { t } = useTranslation('common');
    const router = useRouter();

    const onClick = () => router.back();
    
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