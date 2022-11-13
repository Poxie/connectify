import styles from '../../styles/Post.module.scss';
import { selectPostAttachments } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store"
import { PostAttachment } from "./PostAttachment";
import { CSSProperties } from 'react';

export const PostAttachments: React.FC<{
    id: number;
}> = ({ id }) => {
    const attachments = useAppSelector(state => selectPostAttachments(state, id));
    console.log(attachments);
    if(!attachments?.length) return null;

    const rowAmount = attachments.length > 3 ? 3 : attachments.length;
    return(
        <div 
            className={styles['attachments']}
            style={{ '--row-amount': rowAmount } as CSSProperties}
        >
            {attachments?.map((attachment, key) => (
                <PostAttachment 
                    {...attachment} 
                    index={key}
                    key={attachment.id} 
                />
            ))}
        </div>
    )
}