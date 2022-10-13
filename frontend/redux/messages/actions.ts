import { Channel, Message } from "../../types";
import { ADD_CHANNEL, ADD_MESSAGE, PREPEND_MESSAGES, REMOVE_UNREAD_COUNT, SET_CHANNELS, SET_CHANNEL_FIRST, SET_LAST_CHANNEL_ID, SET_MESSAGES, SET_MESSAGE_FAILED } from "./constants";

export const setChannels = (channels: Channel[]) => ({
    type: SET_CHANNELS,
    payload: channels
})
export const addChannel = (channel: Channel) => ({
    type: ADD_CHANNEL,
    payload: channel
})
export const setChannelFirst = (channelId: number) => ({
    type: SET_CHANNEL_FIRST,
    payload: channelId
})
export const setLastChannelId = (channelId: number | null) => ({
    type: SET_LAST_CHANNEL_ID,
    payload: channelId
})
export const setMessages = (channelId: number, messages: Message[]) => ({
    type: SET_MESSAGES,
    payload: { channelId, messages }
})
export const prependMessages = (channelId: number, messages: Message[]) => ({
    type: PREPEND_MESSAGES,
    payload: { channelId, messages }
})
export const addMessage = (channelId: number, message: Message, shouldIncreaseUnread=false) => ({
    type: ADD_MESSAGE,
    payload: { channelId, message, shouldIncreaseUnread }
})
export const setMessageFailed = (channelId: number, messageId: number) => ({
    type: SET_MESSAGE_FAILED,
    payload: { channelId, messageId }
})
export const removeUnreadCount = (channelId: number) => ({
    type: REMOVE_UNREAD_COUNT,
    payload: channelId
})