import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './SettingsLayout.module.scss';

const TABS = ['Appearance', 'Language'];
export const SettingsSidebar = () => {
    const path = useRouter().asPath;

    return(
        <div className={styles['sidebar']}>
            <h2>
                Settings
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
                                    {tab}
                                </a> 
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}