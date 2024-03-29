import { useTranslation } from 'next-i18next';
import { useAuth } from '../../../contexts/auth/AuthProvider';
import styles from '../../../styles/Account.module.scss';
import { LoginPrompt } from '../../login-prompt/LoginPrompt';
import { SettingsHeader } from "../SettingsHeader"
import { SettingsSection } from '../SettingsSection';
import { ChangePassword } from './ChangePassword';
import { DeleteAccount } from './DeleteAccount';

export const Account = () => {
    const { t } = useTranslation('settings');
    const { token, loading } = useAuth();

    if(!token && !loading) return(
        <div style={{ paddingLeft: 'var(--spacing-primary)' }}>
            <LoginPrompt />
        </div>
    );
    if(loading) return null;
    
    return(
        <div className={styles['container']}>
            <SettingsHeader>
                {t('account.header')}
            </SettingsHeader>
            <SettingsSection title={t('account.changePassword')}>
                <ChangePassword />
            </SettingsSection>
            <SettingsSection title={t('account.deleteAccount')} hasDivider>
                <DeleteAccount />
            </SettingsSection>
        </div>
    )
}