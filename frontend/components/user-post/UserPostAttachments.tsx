import styles from './UserPost.module.scss';
import { selectPostAttachments } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store"
import { UserPostAttachment } from "./UserPostAttachment";
import { CSSProperties } from 'react';

export const UserPostAttachments: React.FC<{
    id: number;
}> = ({ id }) => {
    const attachments = useAppSelector(state => selectPostAttachments(state, id));
    if(!attachments?.length) return null;

    const rowAmount = attachments.length > 3 ? 3 : attachments.length;
    return(
        <div 
            className={styles['attachments']}
            style={{ '--row-amount': rowAmount } as CSSProperties}
        >
            {attachments?.map((attachment, key) => (
                <UserPostAttachment 
                    {...attachment} 
                    index={key}
                    key={attachment.id} 
                />
            ))}
        </div>
    )
}