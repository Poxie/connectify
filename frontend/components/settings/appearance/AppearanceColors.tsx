import { COLORS } from '../../../contexts/theme/constants';
import { Color } from '../../../contexts/theme/types';
import styles from '../../../styles/Appearance.module.scss';
import { AppearanceColor } from './AppearanceColor';

export const AppearanceColors = () => {
    const colors = Object.entries(COLORS).map(([key, value]) => ({
        id: key,
        primaryColor: value.primary,
        secondaryColor: value.secondary
    } as {
        id: Color;
        primaryColor: string;
        secondaryColor: string;
    }));
    return(
        <div className={styles['colors']}>
            {colors.map(color => (
                <AppearanceColor 
                    {...color}
                    key={color.id}
                />
            ))}
        </div>
    )
}