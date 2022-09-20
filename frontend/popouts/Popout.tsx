import styles from '../styles/Popout.module.scss';
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from 'react';

export const Popout: React.FC<{
    children: any;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    width: number;
    height: number;
    left: number;
    top: number;
}> = ({ children, onMouseEnter, onMouseLeave, top: _top, left: _left, width: _width, height: _height }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);

    useEffect(() => {
        if(!ref.current) return;

        // Getting current popout width
        const { width } = ref.current.getBoundingClientRect();

        // Determining popout position
        let left = _left - width + width / 2 + _width / 2;
        if(left < 15) left = 15;
        
        let top = _top + 40;

        // Setting popout position
        setLeft(left);
        setTop(top);
    }, [_top, _left]);

    return(
        <motion.div
            className={styles['container']}
            style={{
                left: `${left}px`,
                top: `${top}px`,

            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={ref}
        >
            <div className={styles['content']}>
                {children}
            </div>
        </motion.div>
    )
}