import { CSSProperties, ReactElement } from "react";
import styles from './Tooltip.module.scss';

export const Tooltip: React.FC<{
    children: ReactElement;
    text: string;
    delay?: number;
    className?: string;
    onClick?: () => void;
}> = ({ children, className, onClick, text, delay=0 }) => {
    className = [
        styles['container'],
        className
    ].join(' ');
    return(
        <div 
            className={className} 
            onClick={onClick}
            data-tooltip={text}
            style={{ '--delay': `${delay}ms` } as CSSProperties}
        >
            {children}
        </div>
    )
}