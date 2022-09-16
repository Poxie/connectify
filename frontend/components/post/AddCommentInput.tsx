import styles from '../../styles/Post.module.scss';
import { useState } from "react"
import Button from "../button";
import { Input } from "../input"
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useDispatch } from 'react-redux';
import { addPostComment } from '../../redux/posts/actions';

export const AddCommentInput: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { post } = useAuth();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [value, setValue] = useState('');

    // Function to create comment
    const addComment = () => {
        // Making sure you can't send empty comment
        if(!value) return;

        // Setting disabled
        setDisabled(true);

        // Creating comment
        post(`/posts/${postId}/comments`, {
            content: value
        })
            .then(comment => {
                // Adding comment to post locally
                dispatch(addPostComment(postId, comment));

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
                placeholder={'Add comment...'} 
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
                        Cancel
                    </Button>
                    <Button 
                        onClick={addComment}
                        disabled={disabled}
                    >
                        Add Comment
                    </Button>
                </div>
            )}
        </div>
    )
}