import Image from "next/image";
import Link from "next/link";
import { HasPopout } from "../../popouts/HasPopout";
import { UserPopout } from "../../popouts/user/UserPopout";
import { User } from "../../types"
import styles from './UserPost.module.scss';

export const UserPostAuthor: React.FC<User> = (user) => {
    const { id, display_name, username, avatar } = user;
    return(
        <>
        <HasPopout popout={<UserPopout {...user} />}>
            <Link href={`/users/${id}`}>
                <a className={styles['author-avatar']} aria-label={`${display_name || username}'s avatar`}>
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${avatar}`}
                        objectFit={'cover'}
                        width={25}
                        height={25}
                    />
                </a>
            </Link>
        </HasPopout>
        <HasPopout popout={<UserPopout {...user} />}>
            <Link href={`/users/${id}`}>
                <a className={styles['author-name']}>
                    {display_name || username}
                </a>
            </Link>
        </HasPopout>
        </>
    )
}