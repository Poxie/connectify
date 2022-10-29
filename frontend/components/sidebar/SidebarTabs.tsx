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
import { useAppSelector } from '../../redux/store';
import { useTranslation } from 'next-i18next';
import { selectUnreadCount } from '../../redux/notifications/selectors';
import { selectLastChannelId, selectTotalUnreadCount } from '../../redux/messages/selectors';

export const SidebarTabs = () => {
    const { t } = useTranslation('common');
    const messageUnreadCount = useAppSelector(selectTotalUnreadCount);
    const notificationUnreadCount = useAppSelector(selectUnreadCount);
    const lastChannelId = useAppSelector(selectLastChannelId);

    const tabs = [
        { text: t('sidebar.home'), path: '/home', basePath: '/home', activeIcon: <HomeActiveIcon />, neutralIcon: <HomeNeutralIcon /> },
        { text: t('sidebar.messages'), path: `/messages${lastChannelId ? '/' + lastChannelId : ''}`, basePath: `/messages`, activeIcon: <MessagesActiveIcon />, neutralIcon: <MessagesNeutralIcon />, notificationCount: messageUnreadCount },
        { text: t('sidebar.notifications'), path: '/notifications', basePath: '/notifications', activeIcon: <NotificationActiveIcon />, neutralIcon: <NotificationNeutralIcon />, notificationCount: notificationUnreadCount },
        { text: t('sidebar.settings'), path: '/settings/appearance', basePath: '/settings', activeIcon: <SettingsActiveIcon />, neutralIcon: <SettingsNeutralIcon /> }
    ]

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