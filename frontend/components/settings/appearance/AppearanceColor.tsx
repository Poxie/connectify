import styles from '../../../styles/Appearance.module.scss';
import { Color } from "../../../contexts/theme/types"
import { useTheme } from '../../../contexts/theme/ThemeProvider';
import { CheckIcon } from '../../../assets/icons/CheckIcon';

export const AppearanceColor: React.FC<{
    id: Color;
    primaryColor: string;
    secondaryColor: string;
}> = ({ id, primaryColor, secondaryColor }) => {
    const { setColor, color: activeColor } = useTheme();

    // Setting up aria label
    const ariaLabel = `Select theme color ${id}`;

    // Checking if active
    const active = activeColor === id;
    return(
        <button
            onClick={() => setColor(id)} 
            className={styles['color']}
            style={{ 
                backgroundColor: primaryColor,
                borderColor: secondaryColor
            }}
            aria-label={ariaLabel}
        >
            {active && (
                <CheckIcon />
            )}
        </button>
    )
}