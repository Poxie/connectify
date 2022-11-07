import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ReactElement } from "react";
import { EmptyPrompt } from "../../components/empty-prompt/EmptyPrompt";
import { HomeLayout } from "../../layouts/home/HomeLayout";
import { NextPageWithLayout } from "../_app";

const Explore: NextPageWithLayout = () => {
    const { t } = useTranslation('home');
    const { t:g } = useTranslation('common')
    return(
        <>
        <Head>
            <title>
                {t('explore.title')} - {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </title>
            <meta property="og:description" content={t('explore.description')} />
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/home`} />
        </Head>

        <EmptyPrompt 
            header={g('comingSoonHeader')}
            message={g('comingSoonSubHeader')}
            buttons={[
                { text: t('feed.title'), type: 'default', path: '/home' }
            ]}
        />
        </>
    )
}
Explore.getLayout = (page: ReactElement) => (
    <HomeLayout>
        {page}
    </HomeLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'home']))
    }
})

export default Explore;