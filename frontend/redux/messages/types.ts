import { AnyAction } from "redux";
import { Channel, Message } from "../../types"

export type MessagesState = {
    lastChannelId: number | null;
    channels: Channel[];
    messages: {[key: number]: Message[] | undefined};
    totalUnreadCount: number;
};

export type Reducer = (state: MessagesState, action: AnyAction) => MessagesState;