import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store"


export const selectExploreLoading = (state: RootState) => state.explore.loading;
export const selectExploreFilter = (state: RootState) => state.explore.activeFilter;

export const selectExploreTopPostIds = (state: RootState) => state.explore.top;
export const selectExploreLatestPostIds = (state: RootState) => state.explore.latest;

export const selectExplorePostIds = createSelector(
    [selectExploreTopPostIds, selectExploreLatestPostIds, selectExploreFilter],
    (top, latest, filter) => filter === 'top' ? top : latest
)

export const selectExploreTopReachedEnd = (state: RootState) => state.explore.topReachedEnd;
export const selectExploreLatestReachedEnd = (state: RootState) => state.explore.latestReachedEnd;