import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ReactElement } from "react";
import { UserProfile } from "../../../components/user";
import { UserLayout } from "../../../layouts/user/UserLayout";
import { User } from "../../../types";
import { NextPageWithLayout } from "../../_app";

const User: NextPageWithLayout<{
    user: User | undefined;
}> = ({ user }) => {
    return(
        <>
        <Head>
            <title>
                {user?.display_name || user?.username} - {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </title>
            <meta property="og:description" content={user?.bio} />
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${user?.avatar}`} />
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/users/${user?.id}`} />
        </Head>

        <UserProfile />
        </>
    )
}

User.getLayout = (page: ReactElement) => (
    <UserLayout>
        {page}
    </UserLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ locale, query: { userId } }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}`);
    const user = await res.json();

    return{
        props: {
            user,
            ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'user']))
        }
    }
}

export default User;