import styles from '../../styles/Settings.module.scss'
import { ReactElement } from "react";

export const SettingsSection: React.FC<{
    title: string;
    children: ReactElement;
    hasDivider?: boolean;
}> = ({ title, children, hasDivider }) => {
    const className = [
        styles['section'],
        hasDivider ? styles['has-divider'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <h3>
                {title}
            </h3>
            {children}
        </div>
    )
}