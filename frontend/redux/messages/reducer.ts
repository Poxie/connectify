import { Channel } from "../../types";
import { ADD_CHANNEL, ADD_MESSAGE, REMOVE_UNREAD_COUNT, SET_CHANNELS, SET_MESSAGES } from "./constants"
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
        case ADD_CHANNEL: {
            let channels = {...state.channels}
            channels[action.payload.id] = action.payload;

            return {
                ...state,
                channels
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

            return {
                ...state,
                messages
            }
        }
        case REMOVE_UNREAD_COUNT: {
            const channels = {...state.channels};
            channels[action.payload] = {
                ...(channels[action.payload] || {}),
                unread_count: 0
            } as Channel;

            return {
                ...state,
                channels
            }
        }
        default:
            return state;
    }
}