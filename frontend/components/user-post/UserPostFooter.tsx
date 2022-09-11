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
    onPostLike: (id: number) => void;
    onPostUnlike: (id: number) => void;
}> = ({ id, has_liked, like_count, onPostLike, onPostUnlike }) => {
    const { post, destroy } = useAuth();

    const like = useCallback(() => {
        onPostLike(id);
        post(`/posts/${id}/likes`)
            .catch(console.error);
    }, [post, id]);
    const unlike = useCallback(() => {
        onPostUnlike(id);
        destroy(`/posts/${id}/likes`)
            .catch(console.error);
    }, [destroy, id]);

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