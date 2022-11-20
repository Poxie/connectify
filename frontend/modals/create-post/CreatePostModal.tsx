import styles from './CreatePostModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { Input } from '../../components/input';
import { useRef, useState } from 'react';
import { ModalFooter } from '../ModalFooter';
import { useModal } from '../../contexts/modal/ModalProvider';
import { PreviewPostModal } from './PreviewPostModal';
import { useTranslation } from 'next-i18next';
import { PostOptions } from '../../components/post-options/PostOptions';
import { TempPostAttachments } from '../../components/temp-post-attachments/TempPostAttachments';
import { TempAttachment } from '../../types';

const MAX_CHARACTER_LENGTH = 400;
export const CreatePostModal = () => {
    const { t } = useTranslation('common');
    const { close, pushModal } = useModal();
    const properties = useRef({ 
        title: '',
        privacy: ''
    })
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<TempAttachment[]>([]);

    // Preview post
    const previewPost = () => {
        const { title, privacy } = properties.current;
        pushModal(
            <PreviewPostModal 
                title={title}
                content={content}
                privacy={privacy}
                attachments={attachments}
            />
        )
    }

    // Adding attachment
    const onAttachmendAdd = (attachments: TempAttachment[]) => {
        setAttachments(prev => [...prev, ...attachments]);
    }
    const onAttachmentRemove = (id: number) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    }

    // Determining if post is complete
    const disabled = !content || content.length > MAX_CHARACTER_LENGTH;

    const characterClassName = [
        styles['character-length'],
        content.length > MAX_CHARACTER_LENGTH ? styles['error'] : ''
    ].join(' ');
    return(
        <>
        <ModalHeader>
            {t('createPost')}
        </ModalHeader>
        <div className={styles['content']}>
            <Input 
                placeholder={t('postTitle')}
                onChange={value => properties.current.title = value}
            />
            <Input 
                placeholder={t('postContent')}
                textArea={true}
                onChange={setContent}
            />

            <div className={styles['footer']}>
                <PostOptions 
                    onAttachmentAdd={onAttachmendAdd}
                    visibility={'all'}
                    onVisibilityChange={value => properties.current.privacy = value}
                />

                <span className={characterClassName}>
                    {content.length}/{MAX_CHARACTER_LENGTH} {t('characters')}
                </span>
            </div>

            {attachments.length !== 0 && (
                <TempPostAttachments 
                    attachments={attachments}
                    onRemove={onAttachmentRemove}
                />
            )}
        </div>
        <ModalFooter 
            cancelLabel={t('cancel')}
            onCancel={close}
            confirmLabel={t('preview')}
            onConfirm={previewPost}
            confirmDisabled={disabled}
        />
        </>
    )
}