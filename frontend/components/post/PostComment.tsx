import styles from '../../styles/Post.module.scss';
import Image from "next/image";
import { selectCommentById } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { PostCommentContent } from "./PostCommentContent";
import { PostCommentFooter } from "./PostCommentFooter";
import Link from 'next/link';
import { UserPostTimestamp } from '../user-post/UserPostTimestamp';

export const PostComment: React.FC<{
    id: number;
    postId: number;
}> = ({ id, postId }) => {
    const comment = useAppSelector(state => selectCommentById(state, id));
    if(!comment) return null;

    return(
        <li className={styles['comment']}>
            <Link href={`/users/${comment.author_id}`}>
                <a className={styles['comment-avatar']}>
                    <Image 
                        width={25}
                        height={25}
                        objectFit={'cover'}
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${comment.author.avatar}`}
                    />
                </a>
            </Link>
            <div className={styles['comment-main']}>
                <div className={styles['comment-header']}>
                    <Link href={`/users/${comment.author_id}`}>
                        <a className={styles['comment-author']}>
                            {comment.author.display_name || comment.author.username}
                        </a>
                    </Link>
                    <UserPostTimestamp timestamp={comment.timestamp} />
                </div>

                <PostCommentContent content={comment.content} />
                <PostCommentFooter 
                    id={id}
                    has_liked={comment.has_liked}
                />
            </div>
        </li>
    )
}