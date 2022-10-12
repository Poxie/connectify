import styles from '../../styles/Sidebar.module.scss';
import Link from "next/link"
import { ReactElement } from "react";
import { useRouter } from 'next/router';

export const SidebarTab: React.FC<{
    text: string;
    neutralIcon: ReactElement;
    activeIcon: ReactElement;
    path: string;
    notificationCount?: number;
}> = ({ text, neutralIcon, activeIcon, path, notificationCount }) => {
    const currentPath = useRouter().pathname;
    const active = currentPath.startsWith(path);

    const className = [
        styles['tab'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <li>
            <Link href={path}>
                <a className={className}>
                    {active ? activeIcon : neutralIcon}
                    <span className={styles['tab-text']}>
                        {text}
                    </span>
                    {notificationCount !== undefined && notificationCount !== 0 && (
                        <span className={styles['notification-count']}>
                            {notificationCount}
                        </span>
                    )}
                </a>
            </Link>
        </li>
    )
}