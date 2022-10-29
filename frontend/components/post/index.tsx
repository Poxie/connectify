import styles from '../../styles/Post.module.scss';
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { PostComments } from './PostComments';
import { PostMain } from './PostMain';

export const Post = () => {
    const { get, loading } = useAuth();
    const { postId } = useRouter().query as { postId: string };

    return(
        <div className={styles['container']}>
            <PostMain postId={parseInt(postId)} />
            <PostComments postId={parseInt(postId)} />
        </div>
    )
}