import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useAppSelector } from "../../redux/store";
import { setUser } from "../../redux/users/actions";
import { selectUserById } from "../../redux/users/selectors";
import { UserHeader } from "./UserHeader";
import { UserTabs } from "./UserTabs";

export const UserLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    const { get } = useAuth();
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const user = useAppSelector(state => selectUserById(state, parseInt(userId)));

    // Fetching user on mount
    useEffect(() => {
        if(!userId || user) return;

        get(`/users/${userId}`)
            .then(user => {
                dispatch(setUser(user));
            })
    }, [user, userId]);

    return(
        <>
            <UserHeader />
            <UserTabs userId={userId} />
            {children}
        </>
    )
}