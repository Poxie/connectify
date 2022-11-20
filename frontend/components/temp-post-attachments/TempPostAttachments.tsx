import styles from './TempPostAttachments.module.scss';
import { useTranslation } from "next-i18next";
import { TempAttachment } from "../../types";
import { HasTooltip } from '../tooltip/HasTooltip';
import { AddIcon } from '../../assets/icons/AddIcon';

export const TempPostAttachments: React.FC<{
    attachments: TempAttachment[];
    onRemove?: (id: number) => void;
    hasLabel?: boolean;
}> = ({ attachments, onRemove, hasLabel=true }) => {
    const { t } = useTranslation('common');

    return(
        <div className={styles['container']}>
            {hasLabel && (
                <span>
                    {t('attachments')}
                </span>
            )}

            <div className={styles['attachment-container']}>
                {attachments.map(attachment => (
                    <div
                        className={styles['attachment']}
                        style={{ backgroundImage: `url(${attachment.preview})` }}
                        key={attachment.id}
                    >
                        {onRemove && (
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
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}