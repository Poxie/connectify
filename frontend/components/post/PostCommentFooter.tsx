import { useDispatch } from 'react-redux';
import { HeartActiveIcon } from '../../assets/icons/HeartActiveIcon';
import { HeartNeutralIcon } from '../../assets/icons/HeartNeutralIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { addCommentLike, removeCommentLike } from '../../redux/posts/actions';
import styles from '../../styles/Post.module.scss';
import { PostCommentFooterButton } from './PostCommentFooterButton';

export const PostCommentFooter: React.FC<{
    id: number;
    has_liked: boolean;
}> = ({ id, has_liked }) => {
    const { post, destroy } = useAuth();
    const dispatch = useDispatch();

    const toggleLike = async () => {
        const path = `/comments/${id}/likes`;

        if(has_liked) {
            destroy(path);
            dispatch(removeCommentLike(id));
            return
        }

        post(path);
        dispatch(addCommentLike(id));
    }

    return(
        <div className={styles['comment-footer']}>
            <PostCommentFooterButton 
                icon={has_liked ? <HeartActiveIcon /> : <HeartNeutralIcon />}
                onClick={toggleLike}
                text={has_liked ? '1 likes' : '0 likes'}
                active={has_liked}
            />
        </div>
    )
}