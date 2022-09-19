import Image from "next/image";
import Link from "next/link";
import { User } from "../../types"
import styles from './UserPost.module.scss';

export const UserPostAuthor: React.FC<User> = ({ id, display_name, username, avatar }) => {
    return(
        <>
        <Link href={`/users/${id}`}>
            <a className={styles['author-avatar']}>
                {avatar && (
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${avatar}`}
                        width={25}
                        height={25}
                    />
                )}
            </a>
        </Link>
        <Link href={`/users/${id}`}>
            <a className={styles['author-name']}>
                {display_name || username}
            </a>
        </Link>
        </>
    )
}