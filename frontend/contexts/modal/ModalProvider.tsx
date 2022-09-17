import { motion } from 'framer-motion';
import styles from '../../styles/Modal.module.scss';
import React, { ReactElement, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ModalContext as ModalContextType } from './types';

const ModalContext = React.createContext({} as ModalContextType);

export const useModal = () => React.useContext(ModalContext);

export const ModalProvider: React.FC<{
    children: any;
}> = ({ children }) => {
    const [modal, setModal] = useState<null | ReactElement>(null);

    // Setting modal
    const _setModal: ModalContextType['setModal'] = useCallback(modal => {
        setModal(modal);
    }, [setModal]);

    // Closing modal
    const close = useCallback(() => {
        setModal(null);
    }, []);

    const value = {
        setModal: _setModal,
        close
    }
    return(
        <ModalContext.Provider value={value}>
            {children}

            <AnimatePresence>
                {modal && (
                    <>
                    {modal}
                    <motion.div 
                        className={styles['backdrop']}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}    
                    />
                    </>
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    )
}