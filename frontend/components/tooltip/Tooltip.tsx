import { motion } from 'framer-motion';
import { ReactElement, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Tooltip.module.scss';
import { TooltipPosition } from '../../contexts/tooltip/types';

const SPACE_FROM_ORIGIN = 10;
const ANIMATION_SPACING = 5;
export const Tooltip: React.FC<{
    children: ReactElement | string;
    position: TooltipPosition;
    refElement: RefObject<HTMLDivElement>;
}> = ({ children, position, refElement }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if(!ref.current || !refElement.current) return;
        
        // Getting dimensions
        let { left, top, width: refWidth, height: refHeight } = refElement.current.getBoundingClientRect();
        let { width, height } = ref.current.getBoundingClientRect();

        // Getting preliminary position
        top = top + (
            position === 'top' ? (
                - height - SPACE_FROM_ORIGIN
            ) : (
                refHeight + SPACE_FROM_ORIGIN
            )
        )
        left = left - width / 2 + refWidth / 2;

        // Checking if position exceeds viewport
        if(left + width > window.innerWidth - SPACE_FROM_ORIGIN) {
            left = window.innerWidth - width - refWidth - SPACE_FROM_ORIGIN;
        }
        if(left < 0) {
            left = SPACE_FROM_ORIGIN;
        }

        setTooltipPosition({ top, left });
    }, [refElement.current]);

    return(
        <motion.div 
            initial={{ opacity: 0, translateY: position === 'top' ? -ANIMATION_SPACING : ANIMATION_SPACING }}
            exit={{ opacity: 0, translateY: position === 'top' ? -ANIMATION_SPACING : ANIMATION_SPACING }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: .15 }}
            className={styles['container']}
            style={{...tooltipPosition}}
            data-position={position}
            ref={ref}
        >
            {children}
        </motion.div>
    )
}