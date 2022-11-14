import styles from './CreatePostModal.module.scss';
import { TempAttachment } from "./CreatePostModal"
import { HasTooltip } from '../../components/tooltip/HasTooltip';
import { AddIcon } from '../../assets/icons/AddIcon';

export const PreviewAttachments: React.FC<{
    attachments: TempAttachment[];
    onDelete?: (index: number) => void;
}> = ({ attachments, onDelete }) => {
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
                            tooltip={'Remove attachment'}
                            className={styles['remove-attachment']}
                        >
                            <button
                                onClick={() => onDelete(key)}
                                aria-label="Remove attachment"
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