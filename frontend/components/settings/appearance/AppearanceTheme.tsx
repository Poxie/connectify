import styles from '../../../styles/Appearance.module.scss';
import { useTheme } from "../../../contexts/theme/ThemeProvider";
import { Theme } from "../../../contexts/theme/types"
import { AppearanceThemePreview } from './AppearanceThemePreview';
import { useTranslation } from 'next-i18next';

export const AppearanceTheme: React.FC<{
    theme: Theme;
}> = ({ theme }) => {
    const { t } = useTranslation('settings');
    const { setTheme, theme: currentTheme } = useTheme();

    const title = t(`appearance.themes.${theme}`);
    
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