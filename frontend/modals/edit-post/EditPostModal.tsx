import styles from './EditPostModal.module.scss';
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "../../components/input";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useModal } from "../../contexts/modal/ModalProvider";
import { useToast } from "../../contexts/toast/ToastProvider";
import { updatePost } from "../../redux/posts/actions";
import { selectPostAttachments, selectPostMain } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { Post, TempAttachment } from "../../types";
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader";
import { ModalMain } from "../ModalMain";
import { useTranslation } from 'next-i18next';
import { PostOptions } from '../../components/post-options/PostOptions';
import { TempPostAttachments } from '../../components/temp-post-attachments/TempPostAttachments';

export const EditPostModal: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const { t } = useTranslation('common');
    const { patch } = useAuth();
    const { close } = useModal();
    const { setToast } = useToast();
    const dispatch = useDispatch();
    const post = useAppSelector(state => selectPostMain(state, postId));
    const attachments = useAppSelector(state => selectPostAttachments(state, postId));
    const tempPost = useRef<Partial<Post>>({});
    const [tempAttachments, setTempAttachments] = useState<TempAttachment[]>(
        attachments?.map(attachment => ({
            preview: `${process.env.NEXT_PUBLIC_ATTACHMENT_ENDPOINT}/${attachment.id}.${attachment.extension}`,
            id: attachment.id
        })
    ) || []);
    const [contentLength, setContentLength] = useState(post?.content.length);
    const [loading, setLoading] = useState(false);

    if(!post) return null;

    const onPropertyChange = (property: keyof Post, value: any) => {
        if(!tempPost.current) return;
        tempPost.current[property] = value;
        if(property === 'content') setContentLength(value.length);
    }
    const onAttachmentRemove = (id: number) => {
        setTempAttachments(prev => prev?.filter(attachment => attachment.id !== id));
    }
    const onAttachmendAdd = (attachments: TempAttachment[]) => {
        setTempAttachments(prev => [...prev, ...attachments]);
    }

    const onConfirm = async () => {
        if(!tempPost.current) return;

        // Sending content cannot be empty toast
        if(tempPost.current.content?.trim() === '') {
            return setToast(t('editPost.contentError'), 'error');
        }
        
        setLoading(true);
        
        const post = await patch<Post>(`/posts/${postId}`, {
            ...tempPost.current,
            ...{
                // Separating File objects from previously added attachmentIds
                attachment_ids: tempAttachments.filter(a => !a.file).map(a => a.id),
                attachments: tempAttachments.filter(a => a.file).map(a => a.file)
            }
        }).catch(error => {
            setToast(t('editPost.error'), 'error');
        }).finally(() => {
            setLoading(false);
        })
        if(!post) return;

        tempPost.current = {};
        dispatch(updatePost(postId, {...post}));
        setToast(t('editPost.success'), 'success');
    }

    const disabled = (contentLength || 0) > 400;

    const characterClassName = [
        styles['characters'],
        (contentLength || 0) > 400 ? styles['error'] : ''
    ].join(' ');
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
                <div className={styles['footer']}>
                    <PostOptions 
                        onAttachmentAdd={onAttachmendAdd}
                        onVisibilityChange={value => onPropertyChange('privacy', value)}
                        visibility={post.privacy}
                    />
                    <span className={characterClassName}>
                        {contentLength}/400 {t('characters')}
                    </span>
                </div>
                {tempAttachments.length !== 0 && (
                    <TempPostAttachments 
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
                confirmDisabled={disabled}
            />
        </>
    )
}