import { useCallback } from 'react';
import { HeartActiveIcon } from '../../assets/icons/HeartActiveIcon';
import { HeartNeutralIcon } from '../../assets/icons/HeartNeutralIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import styles from './UserPost.module.scss';
import { UserPostFooterButton } from './UserPostFooterButton';

export const UserPostFooter: React.FC<{
    id: number;
    has_liked: boolean;
    like_count: number;
}> = ({ id, has_liked, like_count }) => {
    const { post, destroy } = useAuth();

    const like = useCallback(() => {
        post(`/posts/${id}/likes`)
            .then(console.log)
            .catch(console.error)
    }, [post]);
    const unlike = useCallback(() => {
        destroy(`/posts/${id}/likes`)
            .then(console.log)
            .catch(console.error)
    }, [post]);

    return(
        <div className={styles['footer']}>
            <UserPostFooterButton 
                onClick={has_liked ? unlike : like}
                icon={has_liked ? <HeartActiveIcon /> : <HeartNeutralIcon />}
                text={`${like_count} likes`}
            />
        </div>
    )
}