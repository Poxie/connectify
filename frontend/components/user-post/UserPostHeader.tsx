import styles from './UserPost.module.scss';
import { Post, User } from "../../types"
import { UserPostAuthor } from './UserPostAuthor';
import { UserPostTimestamp } from './UserPostTimestamp';
import { UserPostOptions } from './UserPostOptions';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { UserPostVisibilty } from './UserPostVisibility';

export const UserPostHeader: React.FC<{
    user: User;
    postId: number;
    timestamp: number;
    privacy?: Post['privacy'];
}> = ({ user, postId, timestamp, privacy }) => {
    const { profile } = useAuth();

    return(
        <div className={styles['header']}>
            <div className={styles['header-main']}>
                <UserPostAuthor {...user} />
                <UserPostTimestamp timestamp={timestamp} />
            </div>

            <div className={styles['header-right']}>
                {user.id === profile?.id && (
                    <UserPostVisibilty 
                        postId={postId}
                        privacy={privacy} 
                    />
                )}
                <UserPostOptions postId={postId} />
            </div>
        </div>
    )
}