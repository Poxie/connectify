import Image from 'next/image';
import styles from '../../styles/User.module.scss';
import { User } from "../../types"
import { UserStats } from './UserStats';

export const UserHeaderMain: React.FC<{
    avatar: User['avatar'];
    bio: User['bio'];
    id: User['id'];
    display_name: User['display_name'];
    username: User['username'];
}> = ({ id, bio, username, display_name, avatar }) => {
    return(
        <div className={styles['header-main']}>
            <div className={styles['header-avatar']}>
                <Image 
                    src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${avatar}`}
                    objectFit={'cover'}
                    width={150}
                    height={150}
                />
            </div>
            <div className={styles['header-text']}>
                <h2>
                    {display_name || username}
                </h2>
                {bio && (
                    <span className={styles['header-bio']}>
                        {bio}
                    </span>
                )}
                <UserStats userId={id} />
            </div>
        </div>
    )
}