import styles from '../../styles/Overlay.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';
import { Overlay } from '../../overlays/Overlay';
import { Context, Options } from './types';

const OverlayContext = React.createContext({} as Context);

export const useOverlay = () => React.useContext(OverlayContext);

export const OverlayProvider: React.FC<{
    children: ReactElement | ReactElement[];
}> = ({ children }) => {
    const [overlay, setOverlay] = useState<null | ReactElement>(null);
    const [options, setOptions] = useState<Options>({});

    const _setOverlay: Context['setOverlay'] = (overlay, options={}) => {
        setOverlay(overlay);
        setOptions(options);
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', close);
    }
    const close = (e?: KeyboardEvent) => {
        if(e?.key && e.key !== 'Escape') return;

        if(options.onClose) {
            options.onClose();
        }

        setOptions({});
        setOverlay(null);
        document.body.style.overflow = '';
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