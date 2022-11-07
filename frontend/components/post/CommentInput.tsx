import styles from '../../styles/Post.module.scss';
import { useState } from "react"
import Button from "../button";
import { Input } from "../input"
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useDispatch } from 'react-redux';
import { addPostComment } from '../../redux/posts/actions';
import { useTranslation } from 'next-i18next';
import { Comment } from '../../types';

export const CommentInput: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { t: g } = useTranslation('post');
    const { post, token, loading } = useAuth();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [value, setValue] = useState('');

    // If user is not logged in
    if(!token && !loading) {
        return(
            <div className={styles['add-comment']}>
                <span>
                    You need to login to comment.
                </span>
            </div>
        )
    }

    // Function to create comment
    const addComment = () => {
        // Making sure you can't send empty comment
        if(!value) return;

        // Setting disabled
        setDisabled(true);

        // Creating comment
        post<Comment>(`/posts/${postId}/comments`, {
            content: value
        })
            .then(comment => {
                // Adding comment to post locally
                dispatch(addPostComment(comment));

                // Resetting input value
                setValue('');
                setExpanded(false);
                setDisabled(false);
            })
    }

    // Functions to open and close options
    const close = () => setExpanded(false);
    const open = () => setExpanded(true);

    return(
        <div className={styles['add-comment']}>
            <Input 
                placeholder={g('addComment')} 
                defaultValue={value}
                onChange={setValue}
                onFocus={open}
            />
            {expanded && (
                <div className={styles['add-comment-buttons']}>
                    <Button 
                        type={'transparent'}
                        onClick={close}
                    >
                        {t('cancel')}
                    </Button>
                    <Button 
                        onClick={addComment}
                        disabled={disabled}
                    >
                        {g('addComment')}
                    </Button>
                </div>
            )}
        </div>
    )
}