import { HomeLayoutTabs } from "./HomeLayoutTabs";

export const HomeLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    return(
        <>
        <HomeLayoutTabs />
        {children}
        </>
    )
}