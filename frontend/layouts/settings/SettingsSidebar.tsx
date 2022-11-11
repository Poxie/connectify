import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './SettingsLayout.module.scss';

const TABS = ['appearance', 'language', 'account'];
export const SettingsSidebar = () => {
    const { t } = useTranslation('settings');
    const path = useRouter().asPath;

    return(
        <div className={styles['sidebar']}>
            <h2>
                {t('header')}
            </h2>

            <ul className={styles['tabs']}>
                {TABS.map(tab => {
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