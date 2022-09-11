import { AnyAction } from 'redux';
import { Post } from "../../types"

export type PostsState = {
    posts: {[id: string]: Post | undefined};
}

export type PostsReducer = (state: PostsState, action: AnyAction) => PostsState;