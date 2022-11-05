import styles from '../../styles/User.module.scss';
import { useAppSelector } from "../../redux/store";
import { selectUserStats } from "../../redux/users/selectors";
import { useTranslation } from 'next-i18next';

export const UserStats: React.FC<{
    userId: number;
}> = ({ userId }) => {
    const { t } = useTranslation('common');
    const stats = useAppSelector(state => selectUserStats(state, userId));

    return(
        <div className={styles['stats']}>
            <span>
                {stats.follower_count} {t('followers')}
            </span>
            <span>
                {stats.like_count} {t('likes')}
            </span>
            <span>
                {stats.post_count} {t('posts')}
            </span>
        </div>
    )
}