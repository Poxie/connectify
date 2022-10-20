import styles from './UserPost.module.scss';
import { useRouter } from "next/router";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { OptionsIcon } from "../../assets/icons/OptionsIcon";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useMenu } from "../../contexts/menu/MenuProvider";
import { MenuGroup } from "../../contexts/menu/types";
import { removePost } from "../../redux/posts/actions";
import { selectPostById } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";

export const UserPostOptions: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { profile, destroy } = useAuth();
    const { setMenu } = useMenu();
    const router = useRouter();
    const dispatch = useDispatch();
    const ref = useRef<HTMLButtonElement>(null);
    const post = useAppSelector(state => selectPostById(state, postId));
    const isAuthor = profile?.id === post?.author_id;

    const onClick = () => {
        // Function to copy post URL
        const copyLink = () => {
            navigator.clipboard.writeText(`${window.location.host}/posts/${postId}`);
        }

        // Creating menu groups
        const groups: MenuGroup[] = [
            [
                { text: 'Copy link', onClick: copyLink }
            ]
        ]

        // If user is author, allow delete post
        if(isAuthor) {
            // Deleting post
            const deletePost = () => {
                destroy(`/posts/${postId}`)
                    .then(async () => {
                        if(router.asPath === `/posts/${postId}`) {
                            await router.replace(`/users/${profile?.id}`);
                        }
                        dispatch(removePost(postId));
                    })
            }

            // Unshifting delete options
            groups.unshift([
                { text: 'Delete post', onClick: deletePost, type: 'danger' }
            ])
        }

        setMenu(groups, ref);
    }

    return(
        <button 
            className={styles['options']}
            onClick={onClick}
            ref={ref}
        >
            <OptionsIcon />
        </button>
    )
}