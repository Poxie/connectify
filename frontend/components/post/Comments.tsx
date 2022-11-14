import { RefObject } from 'react';
import styles from '../../styles/Post.module.scss';
import { CommentContainer } from './CommentContainer';
import { CommentInputSection } from './CommentInputSection';

export const Comments: React.FC<{
    containerRef?: RefObject<HTMLDivElement>;
}> = ({ containerRef }) => {
    return(
        <div className={styles['comments']}>
            <CommentInputSection />
            <CommentContainer containerRef={containerRef} />
        </div>
    )
}