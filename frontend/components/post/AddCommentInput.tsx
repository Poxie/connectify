import styles from '../../styles/Post.module.scss';
import { useState } from "react"
import Button from "../button";
import { Input } from "../input"

export const AddCommentInput = () => {
    const [expanded, setExpanded] = useState(false);

    const close = () => setExpanded(false);
    const open = () => setExpanded(true);

    return(
        <div className={styles['add-comment']}>
            <Input 
                placeholder={'Add comment...'} 
                onChange={console.log}
                onSubmit={console.error}
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
                    <Button>
                        Add Comment
                    </Button>
                </div>
            )}
        </div>
    )
}