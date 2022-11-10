import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { CommentNeutralIcon } from '../../assets/icons/CommentNeutralIcon';
import { HeartActiveIcon } from '../../assets/icons/HeartActiveIcon';
import { HeartNeutralIcon } from '../../assets/icons/HeartNeutralIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useModal } from '../../contexts/modal/ModalProvider';
import { LoginModal } from '../../modals/login/LoginModal';
import { addPostLike, removePostLike } from '../../redux/posts/actions';
import { selectPostStats } from '../../redux/posts/selectors';
import { useAppSelector } from '../../redux/store';
import styles from './UserPost.module.scss';
import { UserPostFooterButton } from './UserPostFooterButton';

export const UserPostFooter: React.FC<{
    id: number;
}> = ({ id }) => {
    const { t } = useTranslation();
    const { setModal } = useModal();
    const { token, post, destroy } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const stats = useAppSelector(state => selectPostStats(state, id))

    const toggleLike = async () => {
        // If user is not logged in
        if(!token) {
            setModal(<LoginModal />);
            return;
        }

        // Destroy like
        if(stats.has_liked) {
            dispatch(removePostLike(id));
            destroy(`/posts/${id}/likes`);
            return
        }

        // Create like
        dispatch(addPostLike(id));
        post(`/posts/${id}/likes`);
    }

    const goToPost = () => {
        router.push(`/posts/${id}`);
    }

    const {
        has_liked,
        like_count,
        comment_count
    } = stats;
    return(
        <div className={styles['footer']}>
            <UserPostFooterButton 
                onClick={toggleLike}
                icon={has_liked ? <HeartActiveIcon /> : <HeartNeutralIcon />}
                text={`${like_count} ${t('likes')}`}
                ariaLabel={t('likePost')}
                active={has_liked}
            />
            <UserPostFooterButton 
                onClick={goToPost}
                icon={<CommentNeutralIcon />}
                text={`${comment_count} ${t('comments')}`}
                ariaLabel={t('goToPost')}
            />
        </div>
    )
}