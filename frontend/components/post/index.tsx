import styles from '../../styles/Post.module.scss';
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth/AuthProvider";
import { addPostLike, removePostLike, setPost, setPostComments } from "../../redux/posts/actions";
import { selectPostById } from "../../redux/posts/selectors";
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
    const dispatch = useAppDispatch();

    // Fetching post on mount
    useEffect(() => {
        if(loading) return;

        get(`/posts/${postId}`)
            .then(post => {
                dispatch(setPost(post));
            })
    }, [get, loading, postId]);

    // Fetching post comments
    useEffect(() => {
        if(loading || !post?.id || post?.comments) return;

        get(`/posts/${post.id}/comments`)
            .then(comments => {
                dispatch(setPostComments(post.id, comments));
            })
    }, [post, get, loading])

    // Handling post like and unlike
    const onPostLike = (id: number) => {
        dispatch(addPostLike(id));
    }
    const onPostUnlike = (id: number) => {
        dispatch(removePostLike(id));
    }

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
            />
            <PostTitle title={title} />
            <PostContent content={content} />
            <UserPostFooter 
                comment_count={comment_count}
                like_count={like_count}
                has_liked={has_liked}
                onPostLike={onPostLike}
                onPostUnlike={onPostUnlike}
                id={id}
            />
            <PostComments 
                postId={post.id}
                comment_count={comment_count}
            />
        </div>
    )
}