import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/store';
import { selectUserById } from '../../redux/users/selectors';
import styles from '../../styles/User.module.scss';
import { UserHeaderButtons } from "./UserHeaderButtons";
import { UserHeaderSkeleton } from './UserHeaderSkeleton';

export const UserHeader = () => {
    const { userId } = useRouter().query as { userId: string };
    const user = useAppSelector(state => selectUserById(state, parseInt(userId)));
    if(!user) return <UserHeaderSkeleton />;

    return(
        <div className={styles['header']}>
            <div className={styles['header-banner']} />

            <div className={styles['header-content']}>
                <div className={styles['header-main']}>
                    <div className={styles['header-avatar']}>
                        {/* put user avatar, when applicable */}
                    </div>
                    <div className={styles['header-text']}>
                        <h2>
                            {user.display_name || user.username}
                        </h2>
                        <span>
                            {user.follower_count} followers
                        </span>
                    </div>
                </div>
                <UserHeaderButtons userId={parseInt(userId)} />
            </div>
        </div>
    )
}