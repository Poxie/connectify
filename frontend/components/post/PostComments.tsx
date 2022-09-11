import styles from '../../styles/Post.module.scss';
import { selectCommentIds } from "../../redux/posts/selectors"
import { useAppSelector } from "../../redux/store"
import { PostComment } from './PostComment';
import { PostCommentSkeleton } from './PostCommentSkeleton';

export const PostComments: React.FC<{
    postId: number;
    comment_count: number;
}> = ({ postId, comment_count }) => {
    const commentIds = useAppSelector(state => selectCommentIds(state, postId));

    if(!commentIds) return <PostCommentSkeleton />;

    return(
        <div className={styles['comments']}>
            <span className={styles['comments-header']}>
                {comment_count} comments
            </span>
            
            <ul className={styles['comment-container']}>
                {commentIds?.map(id => (
                    <PostComment 
                        id={id}
                        postId={postId}
                    />
                ))}
            </ul>
        </div>
    )
}