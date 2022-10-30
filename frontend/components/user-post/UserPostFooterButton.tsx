import styles from './UserPost.module.scss';
import { ReactElement } from "react";

export const UserPostFooterButton: React.FC<{
    onClick: () => void;
    icon: ReactElement;
    text: string;
    active?: boolean;
}> = ({ onClick, icon, text, active }) => {
    const className = [
        styles['footer-button'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <button 
            className={className}
            onClick={onClick}
        >
            {icon}
            
            <span>
                {text}
            </span>
        </button>
    )
}