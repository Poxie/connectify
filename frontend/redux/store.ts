import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { useDispatch, useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux/es/types";
import { $CombinedState, AnyAction, combineReducers } from "redux";
import { feedReducer } from "./feed/reducer";
import { FeedState } from "./feed/types";

const combinedReducer = combineReducers({
    feed: feedReducer
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
}

// Hooks
export type AppDispatch = Store['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper(makeStore, { debug: false });