import { UserHeader } from "./UserHeader";
import { UserStickyContainer } from "./UserStickyContainer";
import { UserTabs } from "./UserTabs";

export const UserLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    return(
        <>
            <UserHeader />
            <UserStickyContainer />
            {children}
        </>
    )
}