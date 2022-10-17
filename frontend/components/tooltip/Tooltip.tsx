import { ReactElement } from "react";
import styles from './Tooltip.module.scss';

export const Tooltip: React.FC<{
    children: ReactElement;
    text: string;
    className?: string;
    onClick?: () => void;
}> = ({ children, className, onClick, text }) => {
    className = [
        styles['container'],
        className
    ].join(' ');
    return(
        <div 
            className={className} 
            onClick={onClick}
            data-tooltip={text}
        >
            {children}
        </div>
    )
}