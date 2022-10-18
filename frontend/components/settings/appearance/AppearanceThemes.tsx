import styles from '../../../styles/Appearance.module.scss';
import { AppearanceTheme } from './AppearanceTheme';

const getActiveTheme = () => {
    if(typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
}
export const AppearanceThemes = () => {
    return(
        <div className={styles['themes']}>
            <AppearanceTheme theme={'light'} />
            <AppearanceTheme theme={'light-contrast'} />
            <AppearanceTheme theme={'dark'} />
        </div>
    )
}