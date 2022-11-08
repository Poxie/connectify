import styles from '../../styles/Navbar.module.scss';
import { ReactElement } from "react";
import { HasTooltip } from "../tooltip/HasTooltip";

export const NavbarButton: React.FC<{
    onClick: () => void;
    tooltip: string;
    icon: ReactElement;
}> = ({ onClick, tooltip, icon }) => {
    return(
        <button 
            onClick={onClick}
            aria-label={tooltip}
        >
            <HasTooltip 
                tooltip={tooltip}
                position={'bottom'}
                className={styles['button']}
            >
                {icon}
            </HasTooltip>
        </button>
    )
}