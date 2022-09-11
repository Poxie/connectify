import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setPost } from "../../redux/posts/actions";
import { selectPostById } from "../../redux/posts/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/store";

export const Post = () => {
    const { get, loading } = useAuth();
    const { postId } = useRouter().query as { postId: string };
    const post = useAppSelector(state => selectPostById(state, postId));
    const dispatch = useAppDispatch();

    // Fetching post on mount
    useEffect(() => {
        if(loading) return;

        get(`/posts/${postId}`)
            .then(post => {
                dispatch(setPost(post));
            })
    }, [get, loading, postId]);

    if(!post) return null;

    return(
        <div>
            {post.title}
        </div>
    )
}