import { Language } from "../../components/settings/language/Language";
import { SettingsLayout } from "../../layouts/settings/SettingsLayout";
import { NextPageWithLayout } from "../_app";

const languagePage: NextPageWithLayout = () => <Language />;

languagePage.getLayout = page => (
    <SettingsLayout>
        {page}
    </SettingsLayout>
)

export default languagePage;