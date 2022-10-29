import { AnyAction } from 'redux';
import { Comment, Post } from "../../types"

export type PostsState = {
    posts: Post[];
    comments: Comment[];
}

export type PostsReducer = (state: PostsState, action: AnyAction) => PostsState;