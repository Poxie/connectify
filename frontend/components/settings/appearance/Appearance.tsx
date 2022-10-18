import styles from '../../../styles/Appearance.module.scss';
import { SettingsSection } from '../SettingsSection';
import { AppearanceThemes } from './AppearanceThemes';

export const Appearance = () => {
    return(
        <div className={styles['container']}>
            <h2 className={styles['title']}>
                Appearance
            </h2>
            <SettingsSection title={'Themes'}>
                <AppearanceThemes />
            </SettingsSection>
        </div>
    )
}