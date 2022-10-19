import styles from '../../../styles/Language.module.scss';
import { SettingsHeader } from "../SettingsHeader"
import { SettingsSection } from '../SettingsSection';
import { DisplayLanguage } from './DisplayLanguage';

export const Language = () => {
    return(
        <div className={styles['container']}>
            <SettingsHeader>
                Language
            </SettingsHeader>
            <SettingsSection title={'Display language'}>
                <DisplayLanguage />
            </SettingsSection>
        </div>
    )
}