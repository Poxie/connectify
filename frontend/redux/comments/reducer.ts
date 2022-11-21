import { AnyAction } from "redux";
import { Comment } from "../../types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { ADD_COMMENT, ADD_COMMENTS, ADD_COMMENT_LIKE, REMOVE_COMMENT, REMOVE_COMMENT_LIKE } from "./constants";
import { CommentsState } from "./types";

// Reducer actions
type ReducerAction = (state: CommentsState, action: AnyAction) => CommentsState;

const addComments: ReducerAction = (state, action) => {
    const newComments = action.payload.comments.map((comment: Comment) => {
        return updateObject(comment, { orderType: action.payload.orderType })
    })
    const comments = state.comments.concat(newComments);
    return updateObject(state, { comments });
}

const addComment: ReducerAction = (state, action) => {
    // Adding comment for each comment type
    const commentsToAdd = [];
    commentsToAdd.push(updateObject(action.payload, { orderType: 'top' }));
    commentsToAdd.push(updateObject(action.payload, { orderType: 'latest' }));

    const newComments = [...commentsToAdd, ...state.comments];

    return updateObject(state, { comments: newComments });
}

const removeComment: ReducerAction = (state, action) => {
    const newComments = state.comments.filter(comment => comment.id !== action.payload);
    return updateObject(state, { comments: newComments });
}

const addCommentLike: ReducerAction = (state, action) => {
    const newComments = updateItemInArray(state.comments, action.payload, comment => {
        return updateObject(comment, { has_liked: true, like_count: comment.like_count + 1 })
    })
    return updateObject(state, { comments: newComments });
}

const removeCommentLike: ReducerAction = (state, action) => {
    const newComments = updateItemInArray(state.comments, action.payload, comment => {
        return updateObject(comment, { has_liked: false, like_count: comment.like_count - 1 })
    })
    return updateObject(state, { comments: newComments });
}

// Creating reducer
export const commentsReducer = createReducer({
    comments: []
}, {
    [ADD_COMMENTS]: addComments,
    [ADD_COMMENT]: addComment,
    [REMOVE_COMMENT]: removeComment,
    [ADD_COMMENT_LIKE]: addCommentLike,
    [REMOVE_COMMENT_LIKE]: removeCommentLike
})