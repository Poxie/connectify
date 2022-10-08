import { Channel } from "../../types";
import { ADD_MESSAGE, SET_CHANNELS, SET_MESSAGES } from "./constants"
import { MessagesState, Reducer } from "./types"

const initialState = {
    channels: {},
    messages: {},
    loading: true
} as MessagesState;

export const messagesReducer: Reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_CHANNELS: {
            let channels = {...state.channels};
            action.payload.forEach((channel: Channel) => {
                channels[channel.id] = channel
            });

            return {
                ...state,
                channels,
                loading: false
            }
        }
        case SET_MESSAGES: {
            let messages = {...state.messages};
            messages[action.payload.channelId] = action.payload.messages;

            return {
                ...state,
                messages
            }
        }
        case ADD_MESSAGE: {
            let messages = {...state.messages};
            messages[action.payload.channelId] = [
                ...state.messages[action.payload.channelId] || [],
                ...[action.payload.message]
            ];

            console.log('test');
            return {
                ...state,
                messages
            }
        }
        default:
            return state;
    }
}