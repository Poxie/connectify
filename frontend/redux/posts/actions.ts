import { Post } from "../../types";
import { SET_POST } from "./constants";

export const setPost = (post: Post) => ({
    type: SET_POST,
    payload: post
})