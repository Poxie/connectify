import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store"

export const selectExploreFilter = (state: RootState) => state.explore.activeFilter;

export const selectExploreTopPostIds = (state: RootState) => state.explore.top;
export const selectExploreLatestPostIds = (state: RootState) => state.explore.latest;

export const selectExplorePostIds = createSelector(
    [selectExploreTopPostIds, selectExploreLatestPostIds, selectExploreFilter],
    (top, latest, filter) => filter === 'top' ? top : latest
)