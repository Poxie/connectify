import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { CommentNeutralIcon } from '../../assets/icons/CommentNeutralIcon';
import { HeartActiveIcon } from '../../assets/icons/HeartActiveIcon';
import { HeartNeutralIcon } from '../../assets/icons/HeartNeutralIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useModal } from '../../contexts/modal/ModalProvider';
import { LoginModal } from '../../modals/login/LoginModal';
import { addPostLike, removePostLike } from '../../redux/posts/actions';
import styles from './UserPost.module.scss';
import { UserPostFooterButton } from './UserPostFooterButton';

export const UserPostFooter: React.FC<{
    id: number;
    has_liked: boolean;
    like_count: number;
    comment_count: number;
}> = ({ id, has_liked, like_count, comment_count }) => {
    const { t } = useTranslation();
    const { setModal } = useModal();
    const { token, post, destroy } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();

    // Handling like and unlike
    const like = useCallback(() => {
        // If user is not logged in
        if(!token) {
            setModal(<LoginModal />);
            return;
        }

        dispatch(addPostLike(id));
        post(`/posts/${id}/likes`)
            .catch(console.error);
    }, [token, post, id]);
    const unlike = useCallback(() => {
        dispatch(removePostLike(id));
        destroy(`/posts/${id}/likes`)
            .catch(console.error);
    }, [destroy, id]);

    // Going to post
    const goToPost = () => {
        router.push(`/posts/${id}`);
    }

    return(
        <div className={styles['footer']}>
            <UserPostFooterButton 
                onClick={has_liked ? unlike : like}
                icon={has_liked ? <HeartActiveIcon /> : <HeartNeutralIcon />}
                text={`${like_count} ${t('likes')}`}
            />
            <UserPostFooterButton 
                onClick={goToPost}
                icon={<CommentNeutralIcon />}
                text={`${comment_count} ${t('comments')}`}
            />
        </div>
    )
}