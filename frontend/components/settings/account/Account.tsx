import styles from '../../../styles/Account.module.scss';
import { SettingsHeader } from "../SettingsHeader"
import { SettingsSection } from '../SettingsSection';
import { ChangePassword } from './ChangePassword';

export const Account = () => {
    return(
        <div className={styles['container']}>
            <SettingsHeader>
                Account
            </SettingsHeader>
            <SettingsSection title={'Change password'}>
                <ChangePassword />
            </SettingsSection>
        </div>
    )
}