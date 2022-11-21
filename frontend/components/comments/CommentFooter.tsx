import styles from '../../styles/Comments.module.scss';
import { useDispatch } from "react-redux";
import { HeartActiveIcon } from "../../assets/icons/HeartActiveIcon";
import { HeartNeutralIcon } from "../../assets/icons/HeartNeutralIcon";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useModal } from "../../contexts/modal/ModalProvider";
import { LoginModal } from "../../modals/login/LoginModal";
import { addCommentLike, removeCommentLike } from "../../redux/comments/actions";
import { selectCommentStats } from "../../redux/comments/selectors";
import { useAppSelector } from "../../redux/store";
import { CommentFooterButton } from "./CommentFooterButton";

export const CommentFooter: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    const { setModal } = useModal();
    const { token, post, destroy } = useAuth();
    const dispatch = useDispatch();
    const stats = useAppSelector(state => selectCommentStats(state, commentId));
    if(!stats) return null;

    const toggleLike = () => {
        // User is not logged in
        if(!token) {
            setModal(<LoginModal />);
            return;
        }

        // User has liked; remove like
        if(stats?.has_liked) {
            destroy(`/comments/${commentId}/likes`);
            dispatch(removeCommentLike(commentId));
            return;
        }

        // User has not liked; create like
        post(`/comments/${commentId}/likes`);
        dispatch(addCommentLike(commentId));
    }

    return(
        <div className={styles['footer']}>
            <CommentFooterButton 
                icon={stats.has_liked ? <HeartActiveIcon /> : <HeartNeutralIcon />}
                text={`${stats?.like_count} likes`}
                onClick={toggleLike}
                active={stats.has_liked}
            />
        </div>
    )
}