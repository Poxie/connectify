import { User } from "../../types";
import { SET_USER } from "./constants";

export const setUser = (user: User) => ({
    type: SET_USER,
    payload: user
})