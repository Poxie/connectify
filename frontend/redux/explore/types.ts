export type ExploreFilter = 'top' | 'latest';
export type ExploreState = {
    top: number[];
    latest: number[];
    activeFilter: ExploreFilter;
}