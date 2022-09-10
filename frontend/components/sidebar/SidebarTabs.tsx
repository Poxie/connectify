import styles from '../../styles/Sidebar.module.scss';
import { HomeActiveIcon } from "../../assets/icons/HomeActiveIcon"
import { HomeNeutralIcon } from "../../assets/icons/HomeNeutralIcon"
import { MessagesActiveIcon } from "../../assets/icons/MessagesActiveIcon"
import { MessagesNeutralIcon } from "../../assets/icons/MessagesNeutralIcon"
import { NotificationActiveIcon } from "../../assets/icons/NotificationActiveIcon"
import { NotificationNeutralIcon } from "../../assets/icons/NotificationNeutralIcon"
import { SettingsActiveIcon } from "../../assets/icons/SettingsActiveIcon"
import { SettingsNeutralIcon } from "../../assets/icons/SettingsNeutralIcon"
import { SidebarTab } from "./SidebarTab"

const tabs = [
    { text: 'Home', path: '/home', activeIcon: <HomeActiveIcon />, neutralIcon: <HomeNeutralIcon /> },
    { text: 'Messages', path: '/messages', activeIcon: <MessagesActiveIcon />, neutralIcon: <MessagesNeutralIcon /> },
    { text: 'Notifications', path: '/notifications', activeIcon: <NotificationActiveIcon />, neutralIcon: <NotificationNeutralIcon /> },
    { text: 'Settings', path: '/settings', activeIcon: <SettingsActiveIcon />, neutralIcon: <SettingsNeutralIcon /> }
]
export const SidebarTabs = () => {
    return(
        <ul className={styles['tabs']}>
            {tabs.map(tab => (
                <SidebarTab 
                    {...tab}
                    key={tab.path}
                />
            ))}
        </ul>
    )
}