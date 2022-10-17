import { Channel } from "../../types";
import { ADD_CHANNEL, ADD_MESSAGE, PREPEND_MESSAGES, REMOVE_UNREAD_COUNT, SET_CHANNELS, SET_CHANNEL_FIRST, SET_CHANNEL_TYPING, SET_LAST_CHANNEL_ID, SET_MESSAGES, SET_MESSAGE_FAILED, SET_TOTAL_UNREAD_COUNT } from "./constants"
import { MessagesState, Reducer } from "./types"

const initialState = {
    lastChannelId: null,
    totalUnreadCount: 0,
    channels: [],
    messages: {},
    loading: true
} as MessagesState;

export const messagesReducer: Reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_CHANNELS: {
            const channels = action.payload;

            return {
                ...state,
                channels,
                loading: false
            }
        }
        case ADD_CHANNEL: {
            let channels = [...[action.payload], ...state.channels]

            return {
                ...state,
                channels
            }
        }
        case SET_LAST_CHANNEL_ID: {
            return {
                ...state,
                lastChannelId: action.payload
            }
        }
        case SET_CHANNEL_TYPING: {
            const { channelId, type } = action.payload;

            // Updating channel property
            const channels = state.channels.map(channel => {
                if(channel.id === channelId) {
                    channel = {...channel};
                    channel.typing = type === 'reset' ? 0 : (channel.typing || 0) + 1;
                }
                return channel;
            })

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
        case PREPEND_MESSAGES: {
            const { channelId, messages: messagesToAdd } = action.payload;

            // Prepending messages to channel message array
            let messages = {...state.messages};
            messages[channelId] = [
                ...messagesToAdd,
                ...(messages[channelId] || [])
            ]

            return {
                ...state,
                messages
            }
        }
        case ADD_MESSAGE: {
            // Extracting payload values
            const { channelId, message, shouldIncreaseUnread } = action.payload;

            // If prev messages arent loaded, dont add message
            if(!state.messages[channelId]) {
                // Updating channel unread count
                const channels = state.channels.map(channel => {
                    if(channel.id === channelId) {
                        channel.unread_count = shouldIncreaseUnread ? channel.unread_count + 1 : channel.unread_count;
                    }
                    return channel;
                })
                return {
                    ...state,
                    channels,
                    totalUnreadCount: shouldIncreaseUnread ? state.totalUnreadCount + 1 : state.totalUnreadCount
                };
            }

            // Creating new messages object
            let messages = {...state.messages}

            // Filtering out temp messages
            const newMessages = state.messages[channelId]?.filter(msg => msg.id !== message.tempId)
            newMessages?.push(message);

            // Replacing channel message array
            messages[channelId] = newMessages;

            
            // Updating channel position and increasing unread count

            // Removing channel from array
            let affectedChannel: Channel | undefined;
            const channels = state.channels.filter(channel => {
                if(channel.id === channelId) affectedChannel = {...channel};
                return channel.id !== channelId;
            })
            if(!affectedChannel) return state;

            // Checking if channel should increase unread count
            if(shouldIncreaseUnread) {
                affectedChannel.unread_count++;
            }

            // Updating channel last message
            affectedChannel.last_message = message;

            // Determining new totalUnreadCount
            const totalUnreadCount = shouldIncreaseUnread ? state.totalUnreadCount + 1 : state.totalUnreadCount;

            // Adding channel to start of array
            channels.unshift(affectedChannel);

            return {
                ...state,
                messages,
                channels,
                totalUnreadCount
            }
        }
        case SET_MESSAGE_FAILED: {
            // Extracting payload values
            const { channelId, messageId } = action.payload;

            // Creating new messages object
            const messages = {...state.messages};

            // Updating correct message
            const newMessages = state.messages[channelId]?.map(message => {
                if(message.id === messageId) {
                    message = {...message};
                    message.failed = true;
                }
                return message;
            })

            // Replacing channel message array
            messages[channelId] = newMessages;

            return {
                ...state,
                messages
            }
        }
        case REMOVE_UNREAD_COUNT: {
            let prevCount = 0;
            const channels = state.channels.map(channel => {
                if(channel.id === action.payload) {
                    channel = {...channel};
                    prevCount = channel.unread_count;
                    channel.unread_count = 0;
                }
                return channel
            })

            return {
                ...state,
                channels,
                totalUnreadCount: state.totalUnreadCount - prevCount
            }
        }
        case SET_TOTAL_UNREAD_COUNT: {
            return {
                ...state,
                totalUnreadCount: action.payload
            }
        }
        default:
            return state;
    }
}