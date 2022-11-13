import { AnyAction } from "redux";

export type ExploreFilter = 'top' | 'latest';
export type ExploreState = {
    loading: boolean;
    top: number[];
    latest: number[];
    activeFilter: ExploreFilter
    topReachedEnd: boolean;
    latestReachedEnd: boolean;
}
export type Reducer = (state: ExploreState, action: AnyAction) => ExploreState;