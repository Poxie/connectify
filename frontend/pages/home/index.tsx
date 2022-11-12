import { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Head from "next/head"
import { ReactElement } from "react"
import { Feed } from "../../components/home/feed"
import { HomeLayout } from "../../layouts/home/HomeLayout"
import { NextPageWithLayout } from "../_app"

const Home: NextPageWithLayout = () => {
    const { t } = useTranslation('home');

    const title = t('feed.title') + ` - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`;
    return(
        <>
        <Head>
            <title>
                {title}
            </title>
            <meta property="og:description" content={t('feed.description')} />
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/home`} />
        </Head>
        <Feed />
        </>
    )
}
Home.getLayout = (page: ReactElement) => (
    <HomeLayout>
        {page}
    </HomeLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'home']))
    }
})

export default Home;