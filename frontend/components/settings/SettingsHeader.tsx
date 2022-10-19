import styles from '../../styles/Settings.module.scss';
import { ReactElement } from "react"

export const SettingsHeader: React.FC<{
    children: ReactElement | string;
}> = ({ children }) => {
    return(
        <h2 className={styles['title']}>
            {children}
        </h2>
    )
}