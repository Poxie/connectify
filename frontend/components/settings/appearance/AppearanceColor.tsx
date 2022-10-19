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

    // Determining active and className
    const active = activeColor === id;
    const className = [
        styles['color'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <button
            onClick={() => setColor(id)} 
            className={className}
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