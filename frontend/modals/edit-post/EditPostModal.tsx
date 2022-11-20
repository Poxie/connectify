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
import { Attachment, Post } from "../../types";
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader";
import { ModalMain } from "../ModalMain";
import { useTranslation } from 'next-i18next';
import { PostAttachments } from './PostAttachments';
import { AttachmentIcon } from '../../assets/icons/AttachmentIcon';
import { HasTooltip } from '../../components/tooltip/HasTooltip';
import { Dropdown } from '../../components/dropdown';

export type TempAttachment = {
    preview: string;
    file?: File;
    id: number;
}
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
    const [tempAttachments, setTempAttachments] = useState<TempAttachment[]>(post?.attachments.map(attachment => ({
        preview: `${process.env.NEXT_PUBLIC_ATTACHMENT_ENDPOINT}/${attachment.id}.${attachment.extension}`,
        id: attachment.id
    })) || []);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    if(!post) return null;

    const onPropertyChange = (property: keyof Post, value: any) => {
        if(!tempPost.current) return;
        tempPost.current[property] = value;
    }
    const onAttachmentRemove = (id: number) => {
        setTempAttachments(prev => prev?.filter(attachment => attachment.id !== id));
    }
    const addAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        
        const processedAttachments: TempAttachment[] = []
        for(const file of Array.from(files)) {
            const blob = new Blob([file]);
            const preview = URL.createObjectURL(blob);
            processedAttachments.push({
                file,
                preview,
                id: Math.random()
            })
        }
        setTempAttachments(prev => [...prev, ...processedAttachments]);
    }
    const openAttachmentPrompt = () => {
        inputRef.current?.click();
    }

    const onConfirm = async () => {
        if(!tempPost.current) return;
        setLoading(true);
        
        const post = await patch<Post>(`/posts/${postId}`, {
            ...tempPost.current,
            ...{
                attachment_ids: tempAttachments.filter(a => !a.file).map(a => a.id),
                attachments: tempAttachments.filter(a => a.file).map(a => a.file)
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
                <div>
                    <div className={styles['options']}>
                        <HasTooltip tooltip={t('addAttachment')}>
                            <button 
                                onClick={openAttachmentPrompt}
                                className={styles['button']}
                                aria-label={t('addAttachment')}
                            >
                                <AttachmentIcon />
                                <input 
                                    type="file"
                                    multiple 
                                    onChange={addAttachments}
                                    ref={inputRef}
                                />
                            </button>
                        </HasTooltip>
                        <Dropdown 
                            items={[
                                { text: t('visibility.all'), id: 'all' },
                                { text: t('visibility.semi'), id: 'semi' },
                                { text: t('visibility.private'), id: 'private' }
                            ]}
                            position={'top'}
                            defaultActive={post.privacy}
                            onChange={value => onPropertyChange('privacy', value)}
                        />
                    </div>
                </div>
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