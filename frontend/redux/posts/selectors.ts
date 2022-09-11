import { RootState } from "../store";

export const selectPostById = (state: RootState, postId: number) => state.posts.posts[postId];