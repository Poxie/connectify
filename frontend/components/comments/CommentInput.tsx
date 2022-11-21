import styles from '../../styles/Comments.module.scss';
import { useState } from "react"
import Button from "../button";
import { Input } from "../input"
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { Comment } from '../../types';
import { useToast } from '../../contexts/toast/ToastProvider';
import { addComment } from '../../redux/comments/actions';
import { useAppSelector } from '../../redux/store';
import { selectPostCommentCount, selectPostStats } from '../../redux/posts/selectors';
import { CommentInputSkeleton } from './CommentInputSkeleton';

export const CommentInput: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { post, token, loading } = useAuth();
    const { setToast } = useToast();
    const dispatch = useDispatch();
    const commentCount = useAppSelector(state => selectPostCommentCount(state, postId));
    const [expanded, setExpanded] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [value, setValue] = useState('');

    // If post is not fetched
    if(commentCount === undefined) return <CommentInputSkeleton />;

    // If user is not logged in
    if(!token && !loading) {
        return(
            <div className={styles['comment-input']}>
                <span>
                    {t('loginToComment')}
                </span>
            </div>
        )
    }

    // Function to create comment
    const createComment = async () => {
        if(!value) return;

        setDisabled(true);

        const comment = await post<Comment>(`/posts/${postId}/comments`, {
            content: value
        }).catch(error => {
            setToast(t('commentAddError'), 'error');
            setDisabled(false);
        })
        if(!comment) return;

        // Adding comment locally
        dispatch(addComment(comment));

        // Resetting input value
        setExpanded(false);
        setDisabled(false);
        setValue('');

        // Sending success toast
        setToast(t('commentAddSuccess'), 'success');
    }

    // Functions to open and close options
    const close = () => setExpanded(false);
    const open = () => setExpanded(true);

    return(
        <div className={styles['comment-input']}>
            <span className={styles['comment-count']}>
                {commentCount} {t('comments')}
            </span>
            
            <Input 
                placeholder={t('addComment')}
                defaultValue={value}
                onChange={setValue}
                onFocus={open}
            />
            {expanded && (
                <div className={styles['comment-input-buttons']}>
                    <Button 
                        type={'transparent'}
                        onClick={close}
                    >
                        {t('cancel')}
                    </Button>
                    <Button 
                        onClick={createComment}
                        disabled={disabled}
                    >
                        {t('addComment')}
                    </Button>
                </div>
            )}
        </div>
    )
}