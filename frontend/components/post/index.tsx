import styles from '../../styles/Post.module.scss';
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth/AuthProvider";
import { addPostLike, removePostLike, setPost, setPostComments } from "../../redux/posts/actions";
import { selectPostById, selectPostHasLoadedComments } from "../../redux/posts/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { PostTitle } from './PostTitle';
import { PostContent } from './PostContent';
import { UserPostHeader } from '../user-post/UserPostHeader';
import { UserPostFooter } from '../user-post/UserPostFooter';
import { PostComments } from './PostComments';
import { PostSkeleton } from './PostSkeleton';

export const Post = () => {
    const { get, loading } = useAuth();
    const { postId } = useRouter().query as { postId: string };
    const post = useAppSelector(state => selectPostById(state, parseInt(postId)));
    const commentsAreFetched = useAppSelector(state => selectPostHasLoadedComments(state, parseInt(postId)));
    const dispatch = useAppDispatch();

    // Fetching post on mount
    useEffect(() => {
        if(loading || post) return;

        get(`/posts/${postId}`)
            .then(post => {
                dispatch(setPost(post));
            })
    }, [get, loading, post, postId]);

    // Fetching post comments
    useEffect(() => {
        if(!post?.id || commentsAreFetched) return;

        get(`/posts/${post?.id}/comments`)
            .then(comments => {
                dispatch(setPostComments(post.id, comments));
            })
    }, [post?.id, commentsAreFetched])

    // If post is not present, return null
    if(!post) return <PostSkeleton />;

    // Destructuring properties
    const {
        id,
        author,
        timestamp,
        title,
        content,
        has_liked,
        like_count,
        comment_count
    } = post;
    return(
        <div className={styles['container']}>
            <UserPostHeader 
                user={author}
                timestamp={timestamp}
                postId={id}
            />
            <PostTitle title={title} />
            <PostContent content={content} />
            <UserPostFooter 
                comment_count={comment_count}
                like_count={like_count}
                has_liked={has_liked}
                id={id}
            />
            <PostComments 
                postId={post.id}
                comment_count={comment_count}
            />
        </div>
    )
}