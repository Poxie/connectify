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
                {t('appearance')}
            </SettingsHeader>
            <SettingsSection title={t('themes.header')}>
                <AppearanceThemes />
            </SettingsSection>
            <SettingsSection title={t('colors.header')}>
                <AppearanceColors />
            </SettingsSection>
        </div>
    )
}