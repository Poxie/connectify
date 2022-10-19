import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../redux/store';
import { selectUserById } from '../../redux/users/selectors';
import styles from '../../styles/User.module.scss';
import { UserHeaderButtons } from "./UserHeaderButtons";
import { UserHeaderSkeleton } from './UserHeaderSkeleton';

export const UserHeader = () => {
    const { t } = useTranslation('common');
    const { userId } = useRouter().query as { userId: string };
    const user = useAppSelector(state => selectUserById(state, parseInt(userId)));
    if(!user) return <UserHeaderSkeleton />;

    return(
        <div className={styles['header']}>
            <div 
                className={styles['header-banner']} 
                style={{
                    backgroundImage: user.banner ? `url(${process.env.NEXT_PUBLIC_BANNER_ENDPOINT}${user.banner})` : undefined
                }} 
            />

            <div className={styles['header-content']}>
                <div className={styles['header-main']}>
                    <div className={styles['header-avatar']}>
                        {user.avatar && (
                            <Image 
                                src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${user.avatar}`}
                                width={150}
                                height={150}
                            />
                        )}
                    </div>
                    <div className={styles['header-text']}>
                        <h2>
                            {user.display_name || user.username}
                        </h2>
                        {user.bio && (
                            <span>
                                {user.bio}
                            </span>
                        )}
                        <div className={styles['user-stats']}>
                            <span>
                                {user.follower_count} {t('followers')}
                            </span>
                        </div>
                    </div>
                </div>
                <UserHeaderButtons userId={parseInt(userId)} />
            </div>
        </div>
    )
}