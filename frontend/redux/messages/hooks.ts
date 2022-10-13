import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectChannels = (state: RootState) => state.messages.channels;
const selectId = (_: any, id: number) => id;

export const selectChannelsLoading = (state: RootState) => state.messages.loading;
export const selectChannelIds = (state: RootState) => state.messages.channels.map(channel => channel.id);
export const selectChannelById = createSelector(
    [selectChannels, selectId],
    (channels, id) => channels.find(channel => channel.id === id)
)

export const selectLastChannelId = (state: RootState) => state.messages.lastChannelId;

export const selectChannelUnreadCount = createSelector(
    [selectChannelById],
    channel => channel?.unread_count
);
export const selectCombinedUnreadCount = createSelector(
    [selectChannels],
    channels => channels
        .map(channel => channel.unread_count)
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