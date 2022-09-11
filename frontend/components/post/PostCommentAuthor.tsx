import Link from 'next/link';
import styles from '../../styles/Post.module.scss';
import { User } from "../../types"

export const PostCommentAuthor: React.FC<User> = ({ id, display_name, username }) => {
    return(
        <Link href={`/users/${id}`}>
            <a className={styles['comment-author-name']}>
                {display_name || username}
            </a>
        </Link>
    )
}