import styles from './UserPost.module.scss';
import { motion } from 'framer-motion';

export const UserPostSkeleton = () => {
    return(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles['skeleton']}
            aria-hidden="true"
        >
            <div className={styles['header']}>
                <div className={styles['skeleton-flex']}>
                    <div className={styles['skeleton-avatar']} />
                    <div className={styles['skeleton-name']} />
                    <div className={styles['skeleton-timestamp']} />
                </div>
                <div className={styles['skeleton-options']} />
            </div>
            <div className={styles['skeleton-content']}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
            <div className={styles['skeleton-footer']}>
                <div className={styles['skeleton-footer-button']} />
                <div className={styles['skeleton-footer-button']} />
            </div>
        </motion.div>
    )
}