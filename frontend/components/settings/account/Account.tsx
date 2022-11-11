import { useTranslation } from 'next-i18next';
import styles from '../../../styles/Account.module.scss';
import { SettingsHeader } from "../SettingsHeader"
import { SettingsSection } from '../SettingsSection';
import { ChangePassword } from './ChangePassword';

export const Account = () => {
    const { t } = useTranslation('settings');
    
    return(
        <div className={styles['container']}>
            <SettingsHeader>
                {t('account')}
            </SettingsHeader>
            <SettingsSection title={t('changePassword')}>
                <ChangePassword />
            </SettingsSection>
        </div>
    )
}