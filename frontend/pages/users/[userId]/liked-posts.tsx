import { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Head from "next/head"
import { ReactElement } from "react"
import { LikedPosts } from "../../../components/user/LikedPosts"
import { UserLayout } from "../../../layouts/user/UserLayout"
import { User } from "../../../types"
import { NextPageWithLayout } from "../../_app"

const Liked: NextPageWithLayout<{
    user: User | undefined;
}> = ({ user }) => {
    const { t } = useTranslation('user');

    return(
        <>
        <Head>
            <title>
                {user?.display_name || user?.username}'s {t('likedPosts').toLowerCase()} - {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </title>
            <meta property="og:description" content={user?.bio} />
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${user?.avatar}`} />
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/users/${user?.id}/liked-posts`} />
        </Head>

        <LikedPosts />
        </>
    )
}

Liked.getLayout = (page: ReactElement) => (
    <UserLayout>
        {page}
    </UserLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ locale, query: { userId } }) => {
    const translations = await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'user']);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}`).catch(console.error);
    if(!res) {
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

export default Liked;