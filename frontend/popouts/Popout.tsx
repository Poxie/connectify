import styles from '../styles/Popout.module.scss';
import { motion } from "framer-motion"
import { useLayoutEffect, useRef, useState } from 'react';

const SPACE_FROM_EDGE = 20;
const SPACE_FROM_ELEMENT = 10;
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

    useLayoutEffect(() => {
        if(!ref.current) return;

        const { width, height } = ref.current.getBoundingClientRect();

        // Determining left position
        let left = _left - width + width / 2 + _width / 2;
        if(left < SPACE_FROM_EDGE) left = SPACE_FROM_EDGE;
        
        // Determining top position
        let top = _top + _height + SPACE_FROM_ELEMENT;
        if(top + height > window.innerHeight) {
            const overflowAmount = window.innerHeight - top;
            top = window.innerHeight - overflowAmount - height - SPACE_FROM_EDGE;
        }

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