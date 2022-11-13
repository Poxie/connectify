import styles from '../../styles/Overlay.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';
import { Overlay } from '../../overlays/Overlay';
import { Context } from './types';

const OverlayContext = React.createContext({} as Context);

export const useOverlay = () => React.useContext(OverlayContext);

export const OverlayProvider: React.FC<{
    children: ReactElement | ReactElement[];
}> = ({ children }) => {
    const [overlay, setOverlay] = useState<null | ReactElement>(null);

    const _setOverlay = (overlay: ReactElement) => {
        setOverlay(overlay);

        window.addEventListener('keydown', close);
    }
    const close = (e?: KeyboardEvent) => {
        if(e?.key && e.key !== 'Escape') return;

        setOverlay(null);
        window.removeEventListener('keydown', close);
    }

    const value = {
        setOverlay: _setOverlay,
        close
    }
    return(
        <OverlayContext.Provider value={value}>
            <motion.div
                animate={{ 
                    scale: overlay ? .9 : 1, 
                    opacity: overlay ? .6 : 1
                }}
                transition={{ bounce: false }}
            >
                {children}
            </motion.div>

            <AnimatePresence>
                {overlay && (
                    <div className={styles['container']}>
                        <Overlay>
                            {overlay}
                        </Overlay>
                    </div>
                )}
            </AnimatePresence>
        </OverlayContext.Provider>
    )
}