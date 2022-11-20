import { useTranslation } from "next-i18next";
import { AddIcon } from "../../assets/icons/AddIcon";
import { HasTooltip } from "../../components/tooltip/HasTooltip";
import { TempAttachment } from "./EditPostModal";
import styles from './EditPostModal.module.scss';

export const PostAttachments: React.FC<{
    attachments: TempAttachment[];
    onRemove: (id: number) => void;
}> = ({ attachments, onRemove }) => {
    const { t } = useTranslation('common');

    return(
        <div className={styles['attachments']}>
            <span>
                {t('attachments')}
            </span>

            <div className={styles['attachment-container']}>
                {attachments.map(attachment => (
                    <div
                        className={styles['attachment']}
                        style={{ backgroundImage: `url(${attachment.preview})` }}
                        key={attachment.id}
                    >
                        <HasTooltip 
                            className={styles['remove-attachment']}
                            tooltip={t('removeAttachment')}
                        >
                            <button 
                                onClick={() => onRemove(attachment.id)}
                                aria-label={t('removeAttachment')}
                            >
                                <AddIcon />
                            </button>
                        </HasTooltip>
                    </div>
                ))}
            </div>
        </div>
    )
}