import styles from './UserPost.module.scss';
import { motion } from 'framer-motion';

export const UserPostSkeleton = () => {
    return(
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles['skeleton']}
        >
            <div className={styles['skeleton-flex']}>
                <div className={styles['skeleton-name']} />
                <div className={styles['skeleton-timestamp']} />
            </div>
            <div className={styles['skeleton-content']} />
            <div className={styles['skeleton-footer']}>
                <div className={styles['skeleton-footer-button']} />
            </div>
        </motion.div>
    )
}