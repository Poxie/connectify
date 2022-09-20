import React, { ReactElement, RefObject, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Popout } from '../../popouts/Popout';
import { PopoutContext as PopoutContextType } from './types';

const PopoutContext = React.createContext({} as PopoutContextType);

export const usePopout = () => React.useContext(PopoutContext);

export const PopoutProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [popout, setPopout] = useState<ReactElement | null>(null);
    const [position, setPosition] = useState({left: 0, top: 0});
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const [hoverPopout, setHoverPopout] = useState(false);

    // Handling mouse enter and leave popout
    const onMouseEnter = () => setHoverPopout(true);
    const onMouseLeave = () => {
        setHoverPopout(false);
        close();
    }

    // Setting popout
    const _setPopout = (popout: ReactElement, ref: RefObject<HTMLElement>) => {
        if(!ref.current) return;

        // Setting position of ref element
        const { left, top, height, width } = ref.current.getBoundingClientRect();

        // Setting popout related data
        setPosition({ left, top });
        setDimensions({ width, height });
        setPopout(popout);
    }
    // Closing popouts
    const close = () => {
        setPopout(null);
    }

    const value = {
        setPopout: _setPopout,
        hoverPopout,
        close
    }
    return(
        <PopoutContext.Provider value={value}>
            {children}

            <AnimatePresence>
                {popout && (
                    <Popout
                        top={position.top}
                        left={position.left}
                        width={dimensions.width}
                        height={dimensions.height}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {popout}
                    </Popout>
                )}
            </AnimatePresence>
        </PopoutContext.Provider>
    )
}