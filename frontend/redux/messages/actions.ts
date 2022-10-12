import { Channel, Message } from "../../types";
import { ADD_CHANNEL, ADD_MESSAGE, REMOVE_UNREAD_COUNT, SET_CHANNELS, SET_MESSAGES } from "./constants";

export const setChannels = (channels: Channel[]) => ({
    type: SET_CHANNELS,
    payload: channels
})
export const addChannel = (channel: Channel) => ({
    type: ADD_CHANNEL,
    payload: channel
})
export const setMessages = (channelId: number, messages: Message[]) => ({
    type: SET_MESSAGES,
    payload: { channelId, messages }
})
export const addMessage = (channelId: number, message: Message) => ({
    type: ADD_MESSAGE,
    payload: { channelId, message }
})
export const removeUnreadCount = (channelId: number) => ({
    type: REMOVE_UNREAD_COUNT,
    payload: channelId
})