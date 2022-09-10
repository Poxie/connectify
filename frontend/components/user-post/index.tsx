import styles from './UserPost.module.scss';
import { Post } from "../../types";
import { UserPostHeader } from './UserPostHeader';
import { UserPostContent } from './UserPostContent';
import { UserPostFooter } from './UserPostFooter';
import Link from 'next/link';

export const UserPost: React.FC<Post> = ({
    id,
    author,
    content,
    timestamp,
    like_count,
    has_liked,
}) => {
    return(
        <div className={styles['container']}>
            <UserPostHeader 
                user={author}
                timestamp={timestamp}
            />
            <UserPostContent 
                content={content}
            />
            <UserPostFooter 
                like_count={like_count}
                has_liked={has_liked}
            />
            <Link href={`/posts/${id}`}>
                <a aria-label="Go to post" className={styles['post-link']}/>
            </Link>
        </div>
    )
}