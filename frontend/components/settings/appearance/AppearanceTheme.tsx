import styles from '../../../styles/Appearance.module.scss';
import { useTheme } from "../../../contexts/theme/ThemeProvider";
import { Theme } from "../../../contexts/theme/types"
import { AppearanceThemePreview } from './AppearanceThemePreview';

export const AppearanceTheme: React.FC<{
    theme: Theme;
}> = ({ theme }) => {
    const { setTheme, theme: currentTheme } = useTheme();

    const processedTitle = `${theme.slice(0,1).toUpperCase() + theme.slice(1)}`.replaceAll('-', ' ');
    const title = `${processedTitle} theme`;
    
    const active = theme === currentTheme;
    const className = [
        styles['theme'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <button 
            onClick={() => setTheme(theme)}
            className={className}
        >
            <AppearanceThemePreview theme={theme} />

            <span className={styles['theme-title']}>
                {title}
            </span>
        </button>
    )
}