import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Appearance } from "../../components/settings/appearance/Appearance";
import { SettingsLayout } from "../../layouts/settings/SettingsLayout";
import { NextPageWithLayout } from "../_app";

const appearancePage: NextPageWithLayout = () => <Appearance />;

appearancePage.getLayout = page => (
    <SettingsLayout>
        {page}
    </SettingsLayout>
)

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'settings']))
    }
})

export default appearancePage;