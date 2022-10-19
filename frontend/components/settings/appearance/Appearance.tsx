import styles from '../../../styles/Appearance.module.scss';
import { SettingsHeader } from '../SettingsHeader';
import { SettingsSection } from '../SettingsSection';
import { AppearanceColors } from './AppearanceColors';
import { AppearanceThemes } from './AppearanceThemes';

export const Appearance = () => {
    return(
        <div className={styles['container']}>
            <SettingsHeader>
                Appearance
            </SettingsHeader>
            <SettingsSection title={'Themes'}>
                <AppearanceThemes />
            </SettingsSection>
            <SettingsSection title={'Colors'}>
                <AppearanceColors />
            </SettingsSection>
        </div>
    )
}