import { useTranslation } from 'next-i18next';
import styles from '../../../styles/Appearance.module.scss';
import { SettingsHeader } from '../SettingsHeader';
import { SettingsSection } from '../SettingsSection';
import { AppearanceColors } from './AppearanceColors';
import { AppearanceThemes } from './AppearanceThemes';

export const Appearance = () => {
    const { t } = useTranslation('settings');
    return(
        <div className={styles['container']}>
            <SettingsHeader>
                {t('appearance.header')}
            </SettingsHeader>
            <SettingsSection title={t('appearance.themes.header')}>
                <AppearanceThemes />
            </SettingsSection>
            <SettingsSection title={t('appearance.colors.header')}>
                <AppearanceColors />
            </SettingsSection>
        </div>
    )
}