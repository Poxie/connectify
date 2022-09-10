import styles from '../../styles/Sidebar.module.scss';
import Link from "next/link"
import { ReactElement } from "react";
import { useRouter } from 'next/router';

export const SidebarTab: React.FC<{
    text: string;
    neutralIcon: ReactElement;
    activeIcon: ReactElement;
    path: string;
}> = ({ text, neutralIcon, activeIcon, path }) => {
    const currentPath = useRouter().pathname;
    const active = currentPath === path;

    const className = [
        styles['tab'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <li>
            <Link href={path}>
                <a className={className}>
                    {active ? activeIcon : neutralIcon}
                    {text}
                </a>
            </Link>
        </li>
    )
}