import styles from '../../styles/Overlay.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useRef, useState } from 'react';
import { Overlay } from '../../overlays/Overlay';
import { Context, Options } from './types';

const OverlayContext = React.createContext({} as Context);

export const useOverlay = () => React.useContext(OverlayContext);

export const OverlayProvider: React.FC<{
    children: ReactElement | ReactElement[];
}> = ({ children }) => {
    const [overlay, setOverlay] = useState<null | ReactElement>(null);
    const options = useRef<Options>({});

    const _setOverlay: Context['setOverlay'] = (overlay, _options={}) => {
        setOverlay(overlay);
        options.current = _options;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', close);
    }
    const close = (e?: KeyboardEvent) => {
        if(e?.key && e.key !== 'Escape') return
        if(e?.key && e.key === 'Escape' && options.current.onEscape) {
            options.current.onEscape();
        }

        const opts = options.current;
        if(opts.onClose) {
            opts.onClose(opts.previousPath);
        }

        setOverlay(null);
        options.current = {};
        document.body.style.overflow = '';
        window.removeEventListener('keydown', close);
    }

    const value = {
        setOverlay: _setOverlay,
        hasOverlay: !!overlay,
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