import { motion } from 'framer-motion';
import styles from '../styles/Modal.module.scss';

export const Modal: React.FC<{
    children: any;
}> = ({ children }) => {
    return(
        <motion.div 
            className={styles['container']}
            initial={{ scale: .2, opacity: 0, translateX: '-50%', translateY: '-50%' }}
            animate={{ scale: 1, opacity: 1, translateX: '-50%', translateY: '-50%' }}
            exit={{ scale: .2, opacity: 0, translateX: '-50%', translateY: '-50%' }}
            transition={{ duration: .3 }}
        >
            {children}
        </motion.div>
    )
}