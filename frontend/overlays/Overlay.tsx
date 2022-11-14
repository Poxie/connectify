import styles from '../styles/Overlay.module.scss';
import { ReactElement } from "react"
import { motion } from 'framer-motion';

export const Overlay: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    return(
        <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ bounce: false }}
            className={styles['content']}
        >
            {children}
        </motion.div>
    )
}