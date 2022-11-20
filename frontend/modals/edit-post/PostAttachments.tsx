import { AddIcon } from "../../assets/icons/AddIcon";
import { HasTooltip } from "../../components/tooltip/HasTooltip";
import { TempAttachment } from "./EditPostModal";
import styles from './EditPostModal.module.scss';

export const PostAttachments: React.FC<{
    attachments: TempAttachment[];
    onRemove: (id: number) => void;
}> = ({ attachments, onRemove }) => {
    return(
        <div className={styles['attachments']}>
            <span>
                Attachments
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
                            tooltip={'Remove attachment'}
                        >
                            <button onClick={() => onRemove(attachment.id)}>
                                <AddIcon />
                            </button>
                        </HasTooltip>
                    </div>
                ))}
            </div>
        </div>
    )
}