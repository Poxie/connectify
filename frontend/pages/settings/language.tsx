import { Language } from "../../components/settings/language/Language";
import { SettingsLayout } from "../../layouts/settings/SettingsLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextPageWithLayout } from "../_app";

const languagePage: NextPageWithLayout = () => <Language />;

languagePage.getLayout = page => (
    <SettingsLayout>
        {page}
    </SettingsLayout>
)

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'settings']))
    }
})

export default languagePage;