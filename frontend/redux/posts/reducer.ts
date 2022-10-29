import { Comment, Post } from "../../types";
import { ADD_POST_COMMENT, ADD_POST_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, SET_POST_COMMENTS } from "./constants"
import { PostsReducer } from "./types"

const initialState = {
    posts: [],
    comments: []
}

export const postsReducer: PostsReducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_POST: {
            const post: Post = action.payload;
            post.hasCommentsFetched = false;

            return Object.assign({}, state, {
                posts: state.posts.concat(post)
            })
        }
        case REMOVE_POST: {
            const postId = action.payload;

            return Object.assign({}, state, {
                posts: state.posts.filter(post => post.id !== postId)
            })
        }
        case SET_POST_COMMENTS: {
            // Destructuring payload
            const { comments, postId }: {
                comments: Comment[];
                postId: number;
            } = action.payload;

            return Object.assign({}, state, {
                posts: state.posts.map(post => {
                    if(post.id !== postId) return post;

                    return Object.assign({}, post, {
                        hasCommentsFetched: true
                    })
                }),
                comments: state.comments.concat(comments)
            })
        }
        case ADD_POST_COMMENT: {
            const comment: Comment = action.payload;

            return Object.assign({}, state, {
                // Increasing comment count
                posts: state.posts.map(post => {
                    if(post.id !== comment.post_id) return post;

                    return Object.assign({}, post, {
                        comment_count: post.comment_count + 1
                    })
                }),
                // Adding comment
                comments: state.comments.concat(comment)
            })
        }
        case SET_POSTS: {
            const posts: Post[] = action.payload;

            return Object.assign({}, state, {
                posts: state.posts.concat(posts)
            })
        }
        case ADD_POST_LIKE: {
            const postId = action.payload;
            
            return Object.assign({}, state, {
                posts: state.posts.map(post => {
                    if(post.id !== postId) return post;

                    return Object.assign({}, post, {
                        like_count: post.like_count + 1,
                        has_liked: true
                    })
                })
            })
        }
        case REMOVE_POST_LIKE: {
            const postId = action.payload;

            return Object.assign({}, state, {
                posts: state.posts.map(post => {
                    if(post.id !== postId) return post;

                    return Object.assign({}, post, {
                        like_count: post.like_count - 1,
                        has_liked: !post.has_liked
                    })
                })
            })
        }
        default:
            return state;
    }
}