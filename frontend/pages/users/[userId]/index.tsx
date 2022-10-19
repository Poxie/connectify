import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'user']))
    }
})

export default User;