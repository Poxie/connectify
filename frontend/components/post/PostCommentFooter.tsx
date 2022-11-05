import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { HeartActiveIcon } from '../../assets/icons/HeartActiveIcon';
import { HeartNeutralIcon } from '../../assets/icons/HeartNeutralIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { addCommentLike, removeCommentLike } from '../../redux/posts/actions';
import { selectCommentStats } from '../../redux/posts/selectors';
import { useAppSelector } from '../../redux/store';
import styles from '../../styles/Post.module.scss';
import { PostCommentFooterButton } from './PostCommentFooterButton';

export const PostCommentFooter: React.FC<{
    id: number;
}> = ({ id }) => {
    const { t } = useTranslation('common');
    const { post, destroy } = useAuth();
    const dispatch = useDispatch();
    const stats = useAppSelector(state => selectCommentStats(state, id));
    if(!stats) return null;

    const { has_liked, like_count } = stats;

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
                text={`${like_count} ${t('likes')}`}
                active={has_liked}
            />
        </div>
    )
}