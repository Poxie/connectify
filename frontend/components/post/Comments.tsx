import styles from '../../styles/Post.module.scss';
import { CommentContainer } from './CommentContainer';
import { CommentInputSection } from './CommentInputSection';

export const Comments = () => {
    return(
        <div className={styles['comments']}>
            <CommentInputSection />
            <CommentContainer />
        </div>
    )
}