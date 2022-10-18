import styles from '../../styles/Settings.module.scss'
import { ReactElement } from "react";

export const SettingsSection: React.FC<{
    title: string;
    children: ReactElement;
}> = ({ title, children }) => {
    return(
        <div className={styles['section']}>
            <h3>
                {title}
            </h3>
            {children}
        </div>
    )
}