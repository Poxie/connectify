import styles from '../../styles/Sidebar.module.scss';
import { SidebarTabs } from './SidebarTabs';

export const Sidebar = () => {
    return(
        <div className={styles['container']}>
            <SidebarTabs />
        </div>
    )
}