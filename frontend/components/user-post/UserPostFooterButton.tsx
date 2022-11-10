import styles from './UserPost.module.scss';
import { ReactElement } from "react";

export const UserPostFooterButton: React.FC<{
    onClick: () => void;
    icon: ReactElement;
    text: string;
    active?: boolean;
    ariaLabel?: string;
}> = ({ onClick, icon, text, active, ariaLabel }) => {
    const className = [
        styles['footer-button'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <button 
            className={className}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {icon}
            
            <span>
                {text}
            </span>
        </button>
    )
}