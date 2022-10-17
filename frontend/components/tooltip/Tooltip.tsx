import { CSSProperties, ReactElement } from "react";
import styles from './Tooltip.module.scss';

export const Tooltip: React.FC<{
    children: ReactElement;
    text: string;
    position?: 'top' | 'bottom';
    delay?: number;
    className?: string;
    onClick?: () => void;
}> = ({ children, className, onClick, text, position='top', delay=0 }) => {
    className = [
        styles['container'],
        styles[position],
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