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
import { useTranslation } from 'next-i18next';
import { removeUserPostId } from '../../redux/users/actions';
import { useModal } from '../../contexts/modal/ModalProvider';
import { ConfirmModal } from '../../modals/confirm/ConfirmModal';

export const UserPostOptions: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { profile, destroy } = useAuth();
    const { setModal, close } = useModal();
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
                { text: t('copyLink'), onClick: copyLink }
            ]
        ]

        // If user is author, allow delete post
        if(isAuthor) {
            // Deleting post
            const deletePost = async () => {
                const data = await destroy(`/posts/${postId}`)
                close();
                if(!data || !profile?.id) return;

                // If user is on post, redirect to profile
                if(router.asPath === `/posts/${postId}`) {
                    await router.replace(`/users/${profile?.id}`);
                }
                
                // Removing post from redux
                dispatch(removePost(postId));
                dispatch(removeUserPostId(profile?.id, postId));
            }

            // Opening confirm modal
            const confirmDeletion = () => {
                setModal(
                    <ConfirmModal 
                        onCancel={close}
                        onConfirm={deletePost}
                        header={t('deletePostHeader')}
                        subHeader={t('deletePostSubHeader')}
                        confirmLabel={t('deletePostConfirmLabel')}
                    />
                )
            }

            // Unshifting delete options
            groups.unshift([
                { text: t('deletePost'), onClick: confirmDeletion, type: 'danger' }
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