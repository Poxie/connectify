import { AnyAction } from "redux";
import { User } from "../../types"

export type UsersState = {
    users: User[];
}
export type UsersReducer = (state: UsersState, action: AnyAction) => UsersState;