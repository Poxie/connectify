import { AnyAction } from "redux";
import { Channel, Message } from "../../types"

export type MessagesState = {
    lastChannelId: number | null;
    channels: {[key: number]: Channel | undefined};
    messages: {[key: number]: Message[] | undefined};
    loading: boolean;
};

export type Reducer = (state: MessagesState, action: AnyAction) => MessagesState;