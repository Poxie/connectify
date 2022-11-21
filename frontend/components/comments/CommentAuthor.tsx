import styles from '../../styles/Comments.module.scss';
import Link from "next/link";
import { HasPopout } from "../../popouts/HasPopout";
import { UserPopout } from "../../popouts/user/UserPopout";
import { selectCommentAuthor } from "../../redux/comments/selectors";
import { useAppSelector } from "../../redux/store";

export const CommentAuthor: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    const author = useAppSelector(state => selectCommentAuthor(state, commentId));
    if(!author) return null;

    return(
        <HasPopout popout={<UserPopout {...author} />}>
            <Link href={`/users/${author.id}`}>
                <a className={styles['author']}>
                    {author.display_name || author.username}
                </a>
            </Link>
        </HasPopout>
    )
}