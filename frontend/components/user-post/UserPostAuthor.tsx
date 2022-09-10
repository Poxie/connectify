import Link from "next/link";
import { User } from "../../types"
import styles from './UserPost.module.scss';

export const UserPostAuthor: React.FC<User> = ({ id, display_name, username }) => {
    return(
        <Link href={`/users/${id}`}>
            <a className={styles['author-name']}>
                {display_name || username}
            </a>
        </Link>
    )
}