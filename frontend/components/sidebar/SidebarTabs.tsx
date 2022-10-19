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
import { selectTotalUnreadCount, selectLastChannelId } from '../../redux/messages/hooks';
import { useTranslation } from 'next-i18next';

export const SidebarTabs = () => {
    const { t } = useTranslation('common');
    const totalUnreadCount = useAppSelector(selectTotalUnreadCount);
    const lastChannelId = useAppSelector(selectLastChannelId);

    const tabs = [
        { text: t('sidebar.home'), path: '/home', activeIcon: <HomeActiveIcon />, neutralIcon: <HomeNeutralIcon /> },
        { text: t('sidebar.messages'), path: `/messages${lastChannelId ? '/' + lastChannelId : ''}`, activeIcon: <MessagesActiveIcon />, neutralIcon: <MessagesNeutralIcon />, notificationCount: totalUnreadCount },
        { text: t('sidebar.notifications'), path: '/notifications', activeIcon: <NotificationActiveIcon />, neutralIcon: <NotificationNeutralIcon /> },
        { text: t('sidebar.settings'), path: '/settings', activeIcon: <SettingsActiveIcon />, neutralIcon: <SettingsNeutralIcon /> }
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