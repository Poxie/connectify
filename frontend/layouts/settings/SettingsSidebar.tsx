import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/auth/AuthProvider';
import styles from './SettingsLayout.module.scss';

export const SettingsSidebar = () => {
    const { t } = useTranslation('settings');
    const { token } = useAuth();
    const path = useRouter().asPath;

    const tabs = ['appearance', 'language'];
    if(token) {
        tabs.push('account');
    }
    return(
        <div className={styles['sidebar']}>
            <h2>
                {t('header')}
            </h2>

            <ul className={styles['tabs']}>
                {tabs.map(tab => {
                    const active = path.endsWith(tab.toLowerCase());

                    const className = [
                        styles['tab'],
                        active ? styles['active'] : ''
                    ].join(' ');
                    return(
                        <li key={tab}>
                            <Link href={`/settings/${tab.toLowerCase()}`}>
                                <a className={className}>
                                    {t(tab)}
                                </a> 
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}