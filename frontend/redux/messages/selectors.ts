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
export const selectChannelName = createSelector(
    [selectChannelById],
    channel => channel?.recipients[0].display_name || channel?.recipients[0].username
)

export const selectLastChannelId = (state: RootState) => state.messages.lastChannelId;
export const selectChannelTyping = createSelector(
    [selectChannelById],
    channel => channel?.typing
)

export const selectChannelLastMessage = createSelector(
    [selectChannelById],
    channel => channel?.last_message
)

export const selectChannelUnreadCount = createSelector(
    [selectChannelById],
    channel => channel?.unread_count
);
export const selectTotalUnreadCount = (state: RootState) => state.messages.totalUnreadCount;

export const selectChannelReachedEnd = createSelector(
    [selectChannelById],
    channel => channel?.reachedEnd === true
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