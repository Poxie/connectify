import styles from './UserPopout.module.scss';
import { useAppSelector } from "../../redux/store";
import { selectUserById } from "../../redux/users/selectors";
import Image from 'next/image';
import Button from '../../components/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User } from '../../types';

export const UserPopout: React.FC<User> = (user) => {
    const currentPath = useRouter().asPath;
    const userPath = `/users/${user.id}`;

    return(
        <>
            <div 
                className={styles['banner']}
                style={{ 
                    backgroundImage: user?.banner ? `url(${process.env.NEXT_PUBLIC_BANNER_ENDPOINT}${user.banner})` : undefined 
                }}
            />
            <div className={styles['main']}>
                <Link 
                    className={styles['avatar']}
                    href={`/users/${user.id}`}
                >
                    <a className={styles['avatar']}>
                        {user?.avatar && (
                            <Image 
                                width={75}
                                height={75}
                                src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${user.avatar}`}
                            />
                        )}
                    </a>
                </Link>
                <div className={styles['text']}>
                    <Link href={`/users/${user.id}`}>
                        <a className={styles['name']}>
                            {user?.display_name || user?.username}
                        </a>
                    </Link>
                    <div className={styles['stats']}>
                        <span>
                            {user?.follower_count} followers
                        </span>
                    </div>
                </div>
            </div>

            {userPath !== currentPath && (
                <div className={styles['buttons']}>
                    <Button 
                        className={styles['button']} 
                        type={'secondary'}
                    >
                        Go to profile
                    </Button>
                </div>
            )}
        </>
    )
}