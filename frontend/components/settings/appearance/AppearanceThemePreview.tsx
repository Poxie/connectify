import { Theme } from '../../../contexts/theme/types';
import styles from '../../../styles/Appearance.module.scss';

export const AppearanceThemePreview: React.FC<{
    theme: Theme;
}> = ({ theme }) => {
    return(
        <div 
            className={styles['theme-preview']}
            data-theme={theme}
            aria-hidden="true"
        >
            <div className={styles['theme-preview-nav']}>
                <div />
                <div />
                <div />
            </div>
            <div className={styles['theme-content']}>
                <div className={styles['theme-content-top']}>
                    <div className={styles['theme-text-primary']} />
                    <div className={styles['theme-text-primary']} />
                    <div className={styles['theme-text-primary']} />
                </div>
                <div className={styles['theme-content-bottom']}>
                    <div className={styles['theme-text-secondary']} />
                    <div className={styles['theme-text-secondary']} />
                    <div className={styles['theme-text-secondary']} />
                </div>
            </div>
        </div>
    )
}