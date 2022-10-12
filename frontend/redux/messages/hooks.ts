import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectChannels = (state: RootState) => state.messages.channels;
const selectId = (_: any, id: number) => id;

export const selectChannelsLoading = (state: RootState) => state.messages.loading;
export const selectChannelIds = (state: RootState) => Object.keys(state.messages.channels).map(id => parseInt(id))
export const selectChannelById = createSelector(
    [selectChannels, selectId],
    (channels, id) => channels[id]
)

export const selectChannelUnreadCount = createSelector(
    [selectChannelById],
    channel => channel?.unread_count
);
export const selectCombinedUnreadCount = createSelector(
    [selectChannels],
    channels => 
        Object.entries(channels)
            .map(([key, value]) => channels[parseInt(key)]?.unread_count || 0)
            .reduce((partialSum, a) => partialSum + a, 0)
)

const selectMessages = (state: RootState) => state.messages.messages;
const selectMessageId = (_: any, __: any, id: number) => id;

export const selectMessageIds = createSelector(
    [selectMessages, selectId],
    (messages, channelId) => messages[channelId]?.map(message => message.id)
)
export const selectMessageById = createSelector(
    [selectMessages, selectId, selectMessageId],
    (messages, channelId, messageId) => messages[channelId]?.find(message => message.id === messageId)
);