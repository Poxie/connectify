import { Language } from "../../components/settings/language/Language";
import { SettingsLayout } from "../../layouts/settings/SettingsLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextPageWithLayout } from "../_app";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";

const languagePage: NextPageWithLayout = () => {
    const { t } = useTranslation('settings');

    return(
        <>
        <Head>
            <title>
                {t('language')} - {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </title>
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/settings/language`} />
        </Head>

        <Language />
        </>
    )
}

languagePage.getLayout = page => (
    <SettingsLayout>
        {page}
    </SettingsLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'settings']))
    }
})

export default languagePage;