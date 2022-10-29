import styles from '../../styles/Post.module.scss';
import { selectPostCommentCount, selectPostCommentIds, selectPostHasLoadedComments } from "../../redux/posts/selectors"
import { useAppSelector } from "../../redux/store"
import { PostComment } from './PostComment';
import { PostCommentSkeleton } from './PostCommentSkeleton';
import { Input } from '../input';
import { AddCommentInput } from './AddCommentInput';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { setPostComments } from '../../redux/posts/actions';
import { useDispatch } from 'react-redux';

export const PostComments: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { t: g } = useTranslation('post');
    const { loading, get } = useAuth();
    const dispatch = useDispatch();
    const commentsAreFetched = useAppSelector(state => selectPostHasLoadedComments(state, postId));
    const commentIds = useAppSelector(state => selectPostCommentIds(state, postId));
    const commentCount = useAppSelector(state => selectPostCommentCount(state, postId));
    const fetching = useRef(false);

    // Fetching post comments
    useEffect(() => {
        if(loading || fetching.current || commentsAreFetched || commentsAreFetched === undefined) return;

        fetching.current = true;
        get(`/posts/${postId}/comments`)
            .then(comments => {
                dispatch(setPostComments(postId, comments));
                fetching.current = false;
            })
    }, [get, loading, commentsAreFetched])

    if(!commentsAreFetched) return <PostCommentSkeleton />;

    return(
        <div className={styles['comments']}>
            <span className={styles['comments-header']}>
                {commentCount} {t('comments')}
            </span>

            <AddCommentInput postId={postId} />
            
            {!commentIds.length && (
                <span>
                    {g('noPosts')}
                </span>
            )}

            {commentIds.length !== 0 && (
                <ul className={styles['comment-container']}>
                    {commentIds?.map(id => (
                        <PostComment 
                            id={id}
                            postId={postId}
                            key={id}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}