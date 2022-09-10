import styles from './UserPost.module.scss';
import { User } from "../../types"
import { UserPostAuthor } from './UserPostAuthor';
import { UserPostTimestamp } from './UserPostTimestamp';

export const UserPostHeader: React.FC<{
    user: User;
    timestamp: number;
}> = ({ user, timestamp }) => {
    return(
        <div className={styles['header']}>
            <UserPostAuthor {...user} />
            <UserPostTimestamp timestamp={timestamp} />
        </div>
    )
}