import { AnyAction } from 'redux';
import { Post } from "../../types"

export type FeedState = {
    posts: Post[];
    loading: boolean;
}

export type Reducer = (state: FeedState, action: AnyAction) => FeedState;