import { Appearance } from "../../components/settings/appearance/Appearance";
import { SettingsLayout } from "../../layouts/settings/SettingsLayout";
import { NextPageWithLayout } from "../_app";

const appearancePage: NextPageWithLayout = () => <Appearance />;

appearancePage.getLayout = page => (
    <SettingsLayout>
        {page}
    </SettingsLayout>
)

export default appearancePage;