import React from 'react';
import styles from './UserPost.module.scss';
import { Post } from "../../types";
import { UserPostHeader } from './UserPostHeader';
import { UserPostContent } from './UserPostContent';
import { UserPostFooter } from './UserPostFooter';
import Link from 'next/link';

export const UserPost: React.FC<{
    post: Post;
    onPostLike: (id: number) => void;
    onPostUnlike: (id: number) => void;
}> = React.memo(({
    post: {
        id,
        author,
        content,
        timestamp,
        like_count,
        has_liked,
    },
    onPostLike,
    onPostUnlike
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
                id={id}
                like_count={like_count}
                has_liked={has_liked}
                onPostLike={onPostLike}
                onPostUnlike={onPostUnlike}
            />
            <Link href={`/posts/${id}`}>
                <a aria-label="Go to post" className={styles['post-link']}/>
            </Link>
        </div>
    )
});