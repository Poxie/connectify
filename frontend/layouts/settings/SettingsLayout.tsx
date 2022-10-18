import styles from './SettingsLayout.module.scss';
import { ReactElement } from "react"
import { SettingsSidebar } from "./SettingsSidebar";

export const SettingsLayout: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    return(
        <div className={styles['container']}>
            <SettingsSidebar />
            {children}
        </div>
    )
}