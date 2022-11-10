import styles from './Toast.module.scss';
import { motion } from 'framer-motion';
import { ToastType } from './types';
import React, { useEffect, useRef, useState } from 'react';

const SPACE_FROM_BOTTOM = 20;
export const Toast: React.FC<{
    text: string;
    type: ToastType;
    duration: number;
}> = ({ text, type, duration }) => {
    const [height, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!ref.current) return;
        setHeight(ref.current?.getBoundingClientRect().height);
    }, []);

    const className = [
        styles['container'],
        styles[type]
    ].join(' ');
    return(
        <motion.div 
            style={{ '--duration': `${duration}ms` } as React.CSSProperties}
            className={className}
            initial={{ top: '100%' }}
            exit={{ top: '100%' }}
            animate={{ top: `calc(100% - ${height}px - ${SPACE_FROM_BOTTOM}px)` }}
            ref={ref}
        >
            <span>
                {text}
            </span>
        </motion.div>
    )
}