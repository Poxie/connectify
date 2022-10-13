import { AnyAction } from "redux";
import { Channel, Message } from "../../types"

export type MessagesState = {
    lastChannelId: number | null;
    channels: Channel[];
    messages: {[key: number]: Message[] | undefined};
    loading: boolean;
};

export type Reducer = (state: MessagesState, action: AnyAction) => MessagesState;