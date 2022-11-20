import styles from './EditPostModal.module.scss';
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "../../components/input";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useModal } from "../../contexts/modal/ModalProvider";
import { useToast } from "../../contexts/toast/ToastProvider";
import { updatePost } from "../../redux/posts/actions";
import { selectPostById } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { Post } from "../../types";
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader";
import { ModalMain } from "../ModalMain";
import { useTranslation } from 'next-i18next';
import { PostAttachments } from './PostAttachments';

export const EditPostModal: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { patch } = useAuth();
    const { close } = useModal();
    const { setToast } = useToast();
    const dispatch = useDispatch();
    const post = useAppSelector(state => selectPostById(state, postId));
    const tempPost = useRef<any>({});
    const [tempAttachments, setTempAttachments] = useState(post?.attachments || []);
    const [loading, setLoading] = useState(false);

    if(!post) return null;

    const onPropertyChange = (property: keyof Post, value: any) => {
        if(!tempPost.current) return;
        tempPost.current[property] = value;
    }
    const onAttachmentRemove = (id: number) => {
        setTempAttachments(prev => prev?.filter(attachment => attachment.id !== id));
    }

    const onConfirm = async () => {
        if(!tempPost.current) return;
        setLoading(true);
        
        const post = await patch<Post>(`/posts/${postId}`, {
            ...tempPost.current,
            ...{
                attachment_ids: tempAttachments.map(attachment => attachment.id)
            }
        }).catch(error => {
            setToast(t('editPost.error'), 'error');
        }).finally(() => {
            setLoading(false);
        })

        tempPost.current = {};
        dispatch(updatePost(postId, {...post}));
        setToast(t('editPost.success'), 'success');
    }

    return(
        <>
            <ModalHeader>
                {t('editPost.header')}
            </ModalHeader>
            <ModalMain className={styles['content']}>
                <>
                <Input 
                    onChange={value => onPropertyChange('title', value)}
                    defaultValue={post.title}
                    placeholder={t('editPost.title')}
                    label={t('editPost.title')}
                />
                <Input 
                    onChange={value => onPropertyChange('content', value)}
                    defaultValue={post.content}
                    placeholder={t('editPost.content')}
                    label={t('editPost.content')}
                    textArea
                />
                {tempAttachments.length !== 0 && (
                    <PostAttachments 
                        attachments={tempAttachments}
                        onRemove={onAttachmentRemove}
                    />
                )}
                </>
            </ModalMain>
            <ModalFooter 
                cancelLabel={t('cancel')}
                confirmLabel={t('saveChanges')}
                onCancel={close}
                onConfirm={onConfirm}
                confirmLoading={loading}
            />
        </>
    )
}