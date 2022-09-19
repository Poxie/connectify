import { User } from "../../types"
import styles from '../../styles/Post.module.scss';
import { UserPostTimestamp } from "../user-post/UserPostTimestamp";
import { UserPostAuthor } from "../user-post/UserPostAuthor";

export const PostCommentHeader: React.FC<{
    author: User;
    timestamp: number;
}> = ({ author, timestamp }) => {
    return(
        <div className={styles['comment-header']}>
            <UserPostAuthor {...author} />
            <UserPostTimestamp timestamp={timestamp} />
        </div>
    )
}