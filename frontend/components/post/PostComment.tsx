import styles from '../../styles/Post.module.scss';
import Image from "next/image";
import { selectCommentAuthor, selectCommentById, selectCommentMain } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { PostCommentContent } from "./PostCommentContent";
import { PostCommentFooter } from "./PostCommentFooter";
import Link from 'next/link';
import { UserPostTimestamp } from '../user-post/UserPostTimestamp';

export const PostComment: React.FC<{
    id: number;
    postId: number;
}> = ({ id, postId }) => {
    const author = useAppSelector(state => selectCommentAuthor(state, id));
    const main = useAppSelector(state => selectCommentMain(state, id));
    if(!main || !author) return null;

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
                    />
                </a>
            </Link>
            <div className={styles['comment-main']}>
                <div className={styles['comment-header']}>
                    <Link href={`/users/${author.id}`}>
                        <a className={styles['comment-author']}>
                            {author.display_name || author.username}
                        </a>
                    </Link>
                    <UserPostTimestamp timestamp={timestamp} />
                </div>

                <PostCommentContent content={content} />
                <PostCommentFooter id={id} />
            </div>
        </li>
    )
}