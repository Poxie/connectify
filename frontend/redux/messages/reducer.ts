import { AnyAction } from "redux";
import { Channel } from "../../types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { ADD_CHANNEL, ADD_MESSAGE, PREPEND_MESSAGES, REMOVE_UNREAD_COUNT, SET_CHANNELS, SET_CHANNEL_FIRST, SET_CHANNEL_TYPING, SET_LAST_CHANNEL_ID, SET_MESSAGES, SET_MESSAGE_FAILED, SET_TOTAL_UNREAD_COUNT } from "./constants"
import { MessagesState, Reducer } from "./types"

// Reducer actions
type ReducerAction = (state: MessagesState, action: AnyAction) => MessagesState;

const setChannels: ReducerAction = (state, action) => {
    const channels = action.payload;

    return updateObject(state, {
        channels,
        loading: false
    })
}

const setChannelFirst: ReducerAction = (state, action) => {
    let foundChannel: Channel | undefined;
    const channels = state.channels.filter(channel => {
        if(channel.id === action.payload) foundChannel = channel;
        return channel.id !== action.payload;
    });
    const newChannels = foundChannel ? [...[foundChannel], ...channels] : channels;

    return updateObject(state, { channels: newChannels });
}

const addChannel: ReducerAction = (state, action) => {
    let channels = [...[action.payload], ...state.channels]

    return updateObject(state, { channels })
}

const setLastChannelId: ReducerAction = (state, action) => {
    return updateObject(state, { lastChannelId: action.payload })
}

const setChannelTyping: ReducerAction = (state, action) => {
    const { channelId, type } = action.payload;

    const newChannels = updateItemInArray(state.channels, channelId, channel => {
        return updateObject(channel, {
            typing: type === 'reset' ? 0 : (channel.typing || 0) + 1
        })
    })

    return updateObject(state, { channels: newChannels })
}

const setMessages: ReducerAction = (state, action) => {
    let messages = {...state.messages};
    messages[action.payload.channelId] = action.payload.messages;

    return updateObject(state, { messages });
}

const prependMessages: ReducerAction = (state, action) => {
    const { channelId, messages: messagesToAdd } = action.payload;

    // Prepending messages to channel message array
    const newMessages = updateObject(state.messages, {
        [channelId]: [...messagesToAdd, ...(state.messages[channelId] || [])]
    })

    return updateObject(state, { messages: newMessages })
}

const addMessage: ReducerAction = (state, action) => {
    const { channelId, message, shouldIncreaseUnread } = action.payload;

    // If prev messages arent loaded, dont add message
    if(!state.messages[channelId]) {
        // Updating channel unread count
        const newChannels = updateItemInArray(state.channels, channelId, channel => {
            return updateObject(channel, {
                unread_count: shouldIncreaseUnread ? channel.unread_count + 1 : channel.unread_count
            })
        })

        return updateObject(state, {
            channels: newChannels,
            totalUnreadCount: shouldIncreaseUnread ? state.totalUnreadCount + 1 : state.totalUnreadCount
        })
    }

    // Creating message
    const newMessages = updateObject(state.messages, {
        [channelId]: [
            // Removing the temporary message
            ...(state.messages[channelId]?.filter(msg => msg.id !== message.tempId) || []),
            // Appending message
            ...[message]
        ]
    })

    
    // Updating channel position and increasing unread count

    // Removing channel from array
    let affectedChannel: Channel | undefined;
    const newChannels = state.channels.filter(channel => {
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
    newChannels.unshift(affectedChannel);

    return updateObject(state, {
        messages: newMessages,
        channels: newChannels,
        totalUnreadCount
    })
}

const setMessageFailed: ReducerAction = (state, action) => {
    const { channelId, messageId } = action.payload;
    
    const newMessages = updateObject(state.messages, {
        [channelId]: updateItemInArray(state.messages[channelId] || [], messageId, message => {
            return updateObject(message, {
                failed: true
            })
        })
    });

    return updateObject(state, { messages: newMessages });
}

const removeUnreadCount: ReducerAction = (state, action) => {
    let prevCount = 0;

    const newChannels = updateItemInArray(state.channels, action.payload, channel => {
        prevCount = channel.unread_count;

        return updateObject(channel, {
            unread_count: 0
        })
    })

    return updateObject(state, {
        channels: newChannels,
        totalUnreadCount: state.totalUnreadCount - prevCount
    });
}

const setTotalUnreadCount: ReducerAction = (state, action) => {
    return updateObject(state, { totalUnreadCount: action.payload });
}

// Creating reducer
export const messagesReducer = createReducer({
    messages: [],
    channels: [],
    lastChannelId: null,
    totalUnreadCount: 0,
    loading: true
}, {
    [SET_CHANNELS]: setChannels,
    [ADD_CHANNEL]: addChannel,
    [SET_CHANNEL_FIRST]: setChannelFirst,
    [SET_LAST_CHANNEL_ID]: setLastChannelId,
    [SET_CHANNEL_TYPING]: setChannelTyping,
    [SET_MESSAGES]: setMessages,
    [PREPEND_MESSAGES]: prependMessages,
    [ADD_MESSAGE]: addMessage,
    [SET_MESSAGE_FAILED]: setMessageFailed,
    [REMOVE_UNREAD_COUNT]: removeUnreadCount,
    [SET_TOTAL_UNREAD_COUNT]: setTotalUnreadCount
})