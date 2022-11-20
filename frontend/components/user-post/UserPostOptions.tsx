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
import { useToast } from '../../contexts/toast/ToastProvider';
import { EditPostModal } from '../../modals/edit-post/EditPostModal';

export const UserPostOptions: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { profile, destroy } = useAuth();
    const { setModal, close } = useModal();
    const { setToast } = useToast();
    const { setMenu } = useMenu();
    const router = useRouter();
    const dispatch = useDispatch();
    const ref = useRef<HTMLButtonElement>(null);
    const post = useAppSelector(state => selectPostById(state, postId));
    const isAuthor = profile?.id === post?.author_id;

    const onClick = () => {
        // Function to copy post URL
        const copyLink = () => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
        }

        // Creating menu groups
        const groups: MenuGroup[] = [
            [
                { text: t('copyLink'), onClick: copyLink }
            ]
        ]

        // If user is author, allow delete post
        if(isAuthor) {
            const deletePost = async () => {
                const data = await destroy(`/posts/${postId}`).catch(error => {
                    setToast(t('postDeleteError'), 'error');
                })
                close();
                if(!data || !profile?.id) return;

                // If user is on post, redirect to profile
                if(router.asPath.startsWith(`/posts/${postId}`)) {
                    await router.replace(`/users/${profile?.id}`);
                }
                
                // Removing post from redux
                dispatch(removePost(postId));
                dispatch(removeUserPostId(profile?.id, postId));

                // Sending success toast
                setToast(t('postDeleteSuccess'), 'success');
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

            // Opening edit modal
            const editPost = () => {
                setModal(
                    <EditPostModal 
                        postId={postId}
                    />
                )
            }

            // Unshifting options
            groups.unshift([
                { text: t('editPost.header'), onClick: editPost },
                { text: t('deletePost'), onClick: confirmDeletion, type: 'danger' }
            ])
        }

        setMenu(groups, ref);
    }

    return(
        <button 
            className={styles['options']}
            onClick={onClick}
            aria-label={t('postOptions')}
            ref={ref}
        >
            <OptionsIcon />
        </button>
    )
}