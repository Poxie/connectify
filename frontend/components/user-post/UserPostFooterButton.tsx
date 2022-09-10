import styles from './UserPost.module.scss';
import { ReactElement } from "react";

export const UserPostFooterButton: React.FC<{
    onClick: () => void;
    icon: ReactElement;
    text: string;
}> = ({ onClick, icon, text }) => {
    return(
        <button 
            className={styles['footer-button']}
            onClick={onClick}
        >
            {icon}
            
            <span>
                {text}
            </span>
        </button>
    )
}