import { Comment, Post } from "../../types";
import { ADD_POST_COMMENT, ADD_POST_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, SET_POST_COMMENTS } from "./constants"
import { PostsReducer } from "./types"

const initialState = {
    posts: {}
}

export const postsReducer: PostsReducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_POST: {
            const post = action.payload;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.id]: post
                }
            }
        }
        case REMOVE_POST: {
            const postId = action.payload;

            const posts = {...state.posts};
            delete posts[postId];

            return {
                ...state,
                posts
            }
        }
        case SET_POST_COMMENTS: {
            // Destructuring payload
            const { postId, comments }: {
                postId: number, 
                comments: Comment[]
            } = action.payload;

            // Getting correct post
            let post = state.posts[postId];
            if(!post) return state;
            post = {...post};

            // Adding comments
            post.comments = comments;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [postId]: post
                }
            }
        }
        case ADD_POST_COMMENT: {
            const { postId, comment }: {
                postId: number;
                comment: Comment;
            } = action.payload;

            // Getting correct post
            let post = state.posts[postId];
            if(!post) return state;
            post = {...post};

            // Adding comment
            post.comments = [...[comment], ...(post.comments || [])];
            post.comment_count++;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [postId]: post
                }
            }
        }
        case SET_POSTS: {
            const posts: Post[] = action.payload;
            
            const newPosts = {
                ...state.posts,
            }
            posts.forEach(post => {
                newPosts[post.id] = post;
            })

            return {
                ...state,
                posts: newPosts
            }
        }
        case ADD_POST_LIKE: {
            let post = state.posts[action.payload];
            if(!post) return state;
            post = {...post};

            // Adding like to post
            post.like_count++;
            post.has_liked = true;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.id]: post
                }
            }
        }
        case REMOVE_POST_LIKE: {
            let post = state.posts[action.payload];
            if(!post) return state;
            post = {...post};

            // Removing like from post
            post.like_count--;
            post.has_liked = false;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.id]: post
                }
            }
        }
        default:
            return state;
    }
}