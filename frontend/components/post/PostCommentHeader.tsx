import { User } from "../../types"
import styles from '../../styles/Post.module.scss';
import { UserPostTimestamp } from "../user-post/UserPostTimestamp";
import { PostCommentAuthor } from "./PostCommentAuthor"

export const PostCommentHeader: React.FC<{
    author: User;
    timestamp: number;
}> = ({ author, timestamp }) => {
    return(
        <div className={styles['comment-header']}>
            <PostCommentAuthor {...author} />
            <UserPostTimestamp timestamp={timestamp} />
        </div>
    )
}