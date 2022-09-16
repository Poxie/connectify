import React, { AnchorHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export default function Button({ children, style, onClick, href, ariaLabel, target, disabled=false, className='', type='default' }: {
    children: any;
    type?: 'default' | 'hollow' | 'transparent';
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    href?: string;
    ariaLabel?: string;
    target?: AnchorHTMLAttributes<''>['target'];
    disabled?: boolean;
}) {
    className = [
        className,
        styles['container'],
        styles[type]
    ].join(' ');

    const props = {
        className,
        style,
        onClick,
        disabled,
        'aria-label': ariaLabel
    }

    return href ? (
        <a 
            href={href}
            rel={'noreferrer'}
            target={target}
            {...props}
        >
            {children}
        </a>
    ) : (
        <button {...props}>
            {children}
        </button>
    )
}