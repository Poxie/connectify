import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import styles from '../../../styles/Feed.module.scss';
import Button from '../../button';

export const FeedEmpty = () => {
    const { t } = useTranslation('home');

    return(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .35 }}
            className={styles['empty']}
        >
            <h2>
                {t('feedEmptyHeader')}
            </h2>
            <span>
                {t('feedEmptyMessage')}
            </span>
            <div className={styles['buttons']}>
                <Button href={'/home/explore'}>
                    {t('exploreMode')}
                </Button>
                <Button type={'secondary'}>
                    {t('searchMode')}
                </Button>
            </div>
        </motion.div>
    )
}