import { UserHeader } from "./UserHeader";
import { UserTabs } from "./UserTabs";

export const UserLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    return(
        <>
            <UserHeader />
            <UserTabs />
            {children}
        </>
    )
}