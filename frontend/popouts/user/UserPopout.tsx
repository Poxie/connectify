import styles from './UserPopout.module.scss';
import Image from 'next/image';
import Button from '../../components/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User } from '../../types';
import { useTranslation } from 'next-i18next';

export const UserPopout: React.FC<User> = (user) => {
    const { t } = useTranslation('common');
    const currentPath = useRouter().asPath;
    const userPath = `/users/${user.id}`;

    const name = user.display_name || user.username;
    return(
        <>
            <div 
                className={styles['banner']}
                style={{ 
                    backgroundImage: user.banner ? `url(${process.env.NEXT_PUBLIC_BANNER_ENDPOINT}${user.banner})` : undefined 
                }}
                aria-label={`${name}'s banner`}
            />
            <div className={styles['main']}>
                <Link 
                    className={styles['avatar']}
                    href={`/users/${user.id}`}
                >
                    <a className={styles['avatar']}>
                        <Image 
                            width={75}
                            height={75}
                            objectFit={'cover'}
                            src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${user.avatar}`}
                            alt={`${name}'s avatar`}
                        />
                    </a>
                </Link>
                <div className={styles['text']}>
                    <Link href={`/users/${user.id}`}>
                        <a className={styles['name']}>
                            {name}
                        </a>
                    </Link>
                    <div className={styles['stats']}>
                        <span>
                            {user.follower_count} {t('followers')}
                        </span>
                    </div>
                </div>
            </div>

            {userPath !== currentPath && (
                <div className={styles['buttons']}>
                    <Button 
                        className={styles['button']} 
                        type={'secondary'}
                        href={userPath}
                    >
                        {t('goToProfile')}
                    </Button>
                </div>
            )}
        </>
    )
}