import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { useDispatch, useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux/es/types";
import { $CombinedState, AnyAction, combineReducers } from "redux";
import { commentsReducer } from "./comments/reducer";
import { CommentsState } from "./comments/types";
import { exploreReducer } from "./explore/reducer";
import { ExploreState } from "./explore/types";
import { feedReducer } from "./feed/reducer";
import { FeedState } from "./feed/types";
import { messagesReducer } from "./messages/reducer";
import { MessagesState } from "./messages/types";
import { notificationReducer } from "./notifications/reducer";
import { NotificationState } from "./notifications/types";
import { postsReducer } from "./posts/reducer";
import { PostsState } from "./posts/types";
import { usersReducer } from "./users/reducer";
import { UsersState } from "./users/types";

const combinedReducer = combineReducers({
    feed: feedReducer,
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
    messages: messagesReducer,
    notifications: notificationReducer,
    explore: exploreReducer
});

const reducer = (state: ReturnType<typeof combinedReducer>, action: AnyAction) => {
    if (action.type === HYDRATE) {
        // We dont want to override those values
        delete action.payload.feed;

        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
        return nextState;
    } else {
        return combinedReducer(state, action);
    }
};

export const makeStore = () => configureStore({ reducer: reducer as any });

type Store = ReturnType<typeof makeStore>;

// Types based on store
export type RootState = {
    readonly [$CombinedState]?: undefined;
} & {
    feed: FeedState;
    posts: PostsState;
    comments: CommentsState;
    users: UsersState;
    messages: MessagesState;
    notifications: NotificationState;
    explore: ExploreState;
}

// Hooks
export type AppDispatch = Store['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper(makeStore, { debug: false });