import React from 'react';
import styles from '../../styles/Post.module.scss';
import Image from "next/image";
import { selectCommentAuthor, selectCommentById, selectCommentMain } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { CommentContent } from "./CommentContent";
import { CommentFooter } from "./CommentFooter";
import Link from 'next/link';
import { UserPostTimestamp } from '../user-post/UserPostTimestamp';

export const Comment: React.FC<{
    id: number;
    postId: number;
}> = React.memo(({ id, postId }) => {
    const author = useAppSelector(state => selectCommentAuthor(state, id));
    const main = useAppSelector(state => selectCommentMain(state, id));
    if(!main || !author) return null;

    const name = author.display_name || author.username;
    const { content, timestamp } = main;
    return(
        <li className={styles['comment']}>
            <Link href={`/users/${author.id}`}>
                <a className={styles['comment-avatar']}>
                    <Image 
                        width={25}
                        height={25}
                        objectFit={'cover'}
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${author.avatar}`}
                        alt={`${name}'s avatar`}
                    />
                </a>
            </Link>
            <div className={styles['comment-main']}>
                <div className={styles['comment-header']}>
                    <Link href={`/users/${author.id}`}>
                        <a className={styles['comment-author']}>
                            {name}
                        </a>
                    </Link>
                    <UserPostTimestamp timestamp={timestamp} />
                </div>

                <CommentContent content={content} />
                <CommentFooter id={id} />
            </div>
        </li>
    )
});
Comment.displayName = 'Comment';