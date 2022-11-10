import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { HeartActiveIcon } from '../../assets/icons/HeartActiveIcon';
import { HeartNeutralIcon } from '../../assets/icons/HeartNeutralIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useModal } from '../../contexts/modal/ModalProvider';
import { LoginModal } from '../../modals/login/LoginModal';
import { addCommentLike, removeCommentLike } from '../../redux/posts/actions';
import { selectCommentStats } from '../../redux/posts/selectors';
import { useAppSelector } from '../../redux/store';
import styles from '../../styles/Post.module.scss';
import { CommentFooterButton } from './CommentFooterButton';

export const CommentFooter: React.FC<{
    id: number;
}> = ({ id }) => {
    const { t } = useTranslation('common');
    const { token, loading, post, destroy } = useAuth();
    const { setModal } = useModal();
    const dispatch = useDispatch();
    const stats = useAppSelector(state => selectCommentStats(state, id));
    if(!stats) return null;

    const { has_liked, like_count } = stats;

    const toggleLike = async () => {
        // User is not logged in
        if(!token && !loading) {
            setModal(<LoginModal />);
            return;
        }

        const path = `/comments/${id}/likes`;

        // Destroying like
        if(has_liked) {
            destroy(path);
            dispatch(removeCommentLike(id));
            return
        }

        // Creating like
        post(path);
        dispatch(addCommentLike(id));
    }

    return(
        <div className={styles['comment-footer']}>
            <CommentFooterButton 
                icon={has_liked ? <HeartActiveIcon /> : <HeartNeutralIcon />}
                onClick={toggleLike}
                text={`${like_count} ${t('likes')}`}
                active={has_liked}
            />
        </div>
    )
}