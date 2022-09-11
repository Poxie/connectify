import { RootState } from "../store";

export const selectPostById = (state: RootState, postId: string) => state.posts.posts[postId];