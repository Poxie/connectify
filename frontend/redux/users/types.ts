import { AnyAction } from "redux";
import { User } from "../../types"

export type UsersState = {
    users: {[userId: number]: User | undefined};
}
export type UsersReducer = (state: UsersState, action: AnyAction) => UsersState;