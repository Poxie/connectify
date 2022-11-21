import styles from '../../styles/Comments.module.scss';
import Image from "next/image";
import { HasPopout } from "../../popouts/HasPopout";
import { UserPopout } from "../../popouts/user/UserPopout";
import { selectCommentAuthor } from "../../redux/comments/selectors";
import { useAppSelector } from "../../redux/store";
import Link from 'next/link';

export const CommentAvatar: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    const author = useAppSelector(state => selectCommentAuthor(state, commentId));
    if(!author) return null;

    return(
        <HasPopout 
            popout={<UserPopout {...author} />}
            className={styles['avatar']}
        >
            <Link href={`/users/${author.id}`}>
                <a className={styles['avatar']}>
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${author?.avatar}`}
                        width={32}
                        height={32}
                    />
                </a>
            </Link>
        </HasPopout>
    )
}