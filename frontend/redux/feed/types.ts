import { AnyAction } from 'redux';

export type FeedState = {
    postIds: number[];
    loading: boolean;
    reachedEnd: boolean;
}

export type Reducer = (state: FeedState, action: AnyAction) => FeedState;