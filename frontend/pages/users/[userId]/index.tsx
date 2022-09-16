import { ReactElement } from "react";
import { UserProfile } from "../../../components/user";
import { UserLayout } from "../../../layouts/user/UserLayout";
import { NextPageWithLayout } from "../../_app";

const User: NextPageWithLayout = () => {
    return <UserProfile />
}

User.getLayout = (page: ReactElement) => (
    <UserLayout>
        {page}
    </UserLayout>
)

export default User;