import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { OptionsIcon } from '../../assets/icons/OptionsIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useMenu } from '../../contexts/menu/MenuProvider';
import { MenuGroup } from '../../contexts/menu/types';
import { useModal } from '../../contexts/modal/ModalProvider';
import { useToast } from '../../contexts/toast/ToastProvider';
import { ConfirmModal } from '../../modals/confirm/ConfirmModal';
import { removeComment } from '../../redux/comments/actions';
import { selectCommentAuthor } from '../../redux/comments/selectors';
import { useAppSelector } from '../../redux/store';
import styles from '../../styles/Comments.module.scss';

export const CommentOptions: React.FC<{
    commentId: number;
}> = ({ commentId }) => {
    const { t } = useTranslation('common');
    const { destroy, profile } = useAuth();
    const { setModal, close } = useModal();
    const { setToast } = useToast();
    const { setMenu } = useMenu();
    const router = useRouter();
    const dispatch = useDispatch();
    const author = useAppSelector(state => selectCommentAuthor(state, commentId));
    const ref = useRef<HTMLButtonElement>(null);
    
    const openMenu = () => {
        const goToAuthor = () => router.push(`/users/${author?.id}`);

        const items: MenuGroup[] = [[
            { text: t('goToAuthor'), onClick: goToAuthor }
        ]]

        // If user is author of comment
        if(author?.id === profile?.id) {
            const deleteComment = () => {
                destroy(`/comments/${commentId}`)
                    .then(() => {
                        setToast(t('commentRemoveSuccess'), 'success');
                        dispatch(removeComment(commentId));
                        close();
                    })
                    .catch(() => {
                        setToast(t('commentRemoveError'), 'error');
                    })
            }

            const confirmDeletion = () => {
                setModal(
                    <ConfirmModal 
                        header={t('commentRemoveHeader')}
                        subHeader={t('commentRemoveSubHeader')}
                        onCancel={close}
                        onConfirm={deleteComment}
                    />
                )
            }

            items.push([
                { text: t('commentRemove'), onClick: confirmDeletion, type: 'danger' }
            ]);
        }
        setMenu(items, ref);
    }

    return(
        <button 
            className={styles['options']}
            onClick={openMenu}
            ref={ref}
        >
            <OptionsIcon />
        </button>
    )
}