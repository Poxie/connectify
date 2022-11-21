import styles from '../../styles/Comments.module.scss';
import { ReactElement } from "react";

export const CommentFooterButton: React.FC<{
    text: string;
    icon: ReactElement;
    active: boolean;
    onClick: () => void;
}> = ({ active, icon, text, onClick }) => {
    const className = [
        styles['button'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <button 
            className={className}
            onClick={onClick}
        >
            {icon} {text}
        </button>
    )
}