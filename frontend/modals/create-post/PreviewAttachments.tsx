import styles from './CreatePostModal.module.scss';
import { TempAttachment } from "./CreatePostModal"
import { HasTooltip } from '../../components/tooltip/HasTooltip';
import { AddIcon } from '../../assets/icons/AddIcon';
import { useTranslation } from 'next-i18next';

export const PreviewAttachments: React.FC<{
    attachments: TempAttachment[];
    onDelete?: (index: number) => void;
}> = ({ attachments, onDelete }) => {
    const { t } = useTranslation('common');
    if(!attachments.length) return null;

    return(
        <div className={styles['attachment-container']}>
            {attachments.map((attachment, key) => (
                <div
                    className={styles['attachment']}
                    style={{ backgroundImage: `url(${attachment.preview})` }}
                    key={key}
                >
                    {onDelete && (
                        <HasTooltip 
                            tooltip={t('removeAttachment')}
                            className={styles['remove-attachment']}
                        >
                            <button
                                onClick={() => onDelete(key)}
                                aria-label={t('removeAttachment')}
                            >
                                <AddIcon />
                            </button>
                        </HasTooltip>
                    )}
                </div>
            ))}
        </div>
    )
}