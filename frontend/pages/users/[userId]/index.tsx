import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { UserProfile } from "../../../components/user";
import { useToast } from "../../../contexts/toast/ToastProvider";
import { UserLayout } from "../../../layouts/user/UserLayout";
import { User } from "../../../types";
import { NextPageWithLayout } from "../../_app";

const User: NextPageWithLayout<{
    user: User | undefined;
}> = ({ user }) => {
    const { t } = useTranslation('user');
    const { setToast } = useToast();

    useEffect(() => {
        if(!user) {
            setToast(t('userNotFound'), 'error');
        }
    }, [user]);

    const name = user?.display_name || user?.username
    let title = user ? (
        user?.display_name || user?.username
    ) : (
        t('userNotFound')
    )
    title += ` - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`
    const description = user?.bio ? (
        user.bio.length > 150 ? (
            user.bio.slice(0,150) + '...'
        ) : user.bio
    ) : (
        user ? (
            t('userProfile', { profile: user.display_name || user.username })
        ) : (
            t('userNotFound')
        )
    )
    return(
        <>
        <Head>
            <title>
                {title}
            </title>
            {user && (
                <meta property="og:title" content={name} />
            )}
            <meta property="og:description" content={description} />
            {user && (
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${user.avatar}`} />
            )}
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
    const translations = await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'user']);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}`).catch(console.error);
    if(!res || !res.ok) {
        return { props: { ...translations } };
    }

    const user = await res.json();

    return{
        props: {
            user,
            ...translations
        }
    }
}

export default User;