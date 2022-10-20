import styles from './UserPost.module.scss';
import { User } from "../../types"
import { UserPostAuthor } from './UserPostAuthor';
import { UserPostTimestamp } from './UserPostTimestamp';
import { UserPostOptions } from './UserPostOptions';

export const UserPostHeader: React.FC<{
    user: User;
    postId: number;
    timestamp: number;
}> = ({ user, postId, timestamp }) => {
    return(
        <div className={styles['header']}>
            <div className={styles['header-main']}>
                <UserPostAuthor {...user} />
                <UserPostTimestamp timestamp={timestamp} />
            </div>
            <UserPostOptions postId={postId} />
        </div>
    )
}