import { Channel, Message } from "../../types";
import { ADD_MESSAGE, SET_CHANNELS, SET_MESSAGES } from "./constants";

export const setChannels = (channels: Channel[]) => ({
    type: SET_CHANNELS,
    payload: channels
})
export const setMessages = (channelId: number, messages: Message[]) => ({
    type: SET_MESSAGES,
    payload: { channelId, messages }
})
export const addMessage = (channelId: number, message: Message) => ({
    type: ADD_MESSAGE,
    payload: { channelId, message }
})