import { RefObject } from 'react';
import styles from '../../styles/Post.module.scss';
import { CommentContainer } from './CommentContainer';
import { CommentInputSection } from './CommentInputSection';

export const Comments: React.FC<{
    containerRef?: RefObject<HTMLDivElement>;
    postId: number;
}> = ({ containerRef, postId }) => {
    return(
        <div className={styles['comments']}>
            <CommentInputSection postId={postId} />
            <CommentContainer postId={postId} containerRef={containerRef} />
        </div>
    )
}