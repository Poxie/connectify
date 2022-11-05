import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useAppSelector } from "../../redux/store";
import { setUser } from "../../redux/users/actions";
import { selectUserById } from "../../redux/users/selectors";
import { User } from "../../types";
import { UserHeader } from "./UserHeader";
import { UserTabs } from "./UserTabs";

export const UserLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    const { get, loading } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const user = useAppSelector(state => selectUserById(state, parseInt(userId)));
    const fetching = useRef(false);

    // Fetching user on mount
    useEffect(() => {
        if(!userId || user || loading || fetching.current) return;

        fetching.current = true;
        get<User>(`/users/${userId}`)
            .then(user => {
                fetching.current = false;
                dispatch(setUser(user));
            })
    }, [user, userId, loading]);

    return(
        <>
            <UserHeader />
            <UserTabs userId={userId} />
            {children}
        </>
    )
}