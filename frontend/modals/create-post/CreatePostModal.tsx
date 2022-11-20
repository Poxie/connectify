import styles from './CreatePostModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { Input } from '../../components/input';
import { useRef, useState } from 'react';
import { ModalFooter } from '../ModalFooter';
import { useModal } from '../../contexts/modal/ModalProvider';
import { PreviewPostModal } from './PreviewPostModal';
import { useTranslation } from 'next-i18next';
import { AttachmentIcon } from '../../assets/icons/AttachmentIcon';
import { HasTooltip } from '../../components/tooltip/HasTooltip';
import { AddIcon } from '../../assets/icons/AddIcon';
import { PreviewAttachments } from './PreviewAttachments';
import { Dropdown } from '../../components/dropdown';

export type TempAttachment = {
    preview: string;
    file: File;
}

const MAX_CHARACTER_LENGTH = 400;
export const CreatePostModal = () => {
    const { t } = useTranslation('common');
    const { close, pushModal } = useModal();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState('all');
    const [attachments, setAttachments] = useState<TempAttachment[]>([]);
    const attachmentRef = useRef<HTMLInputElement>(null);

    // Preview post
    const previewPost = () => {
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
    const openAttachmentPrompt = () => attachmentRef.current?.click();
    const addAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        
        const processedAttachments: TempAttachment[] = []
        for(const file of Array.from(files)) {
            const blob = new Blob([file]);
            const preview = URL.createObjectURL(blob);
            processedAttachments.push({
                file,
                preview
            })
        }
        setAttachments(prev => [...prev, ...processedAttachments]);
    }
    const removeAttachment = (index: number) => {
        setAttachments(prev => {
            prev.splice(index, 1);
            return [...prev];
        })
    }

    // Determining if post is complete
    const disabled = !title || !content || content.length > MAX_CHARACTER_LENGTH;

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
                onChange={setTitle}
            />
            <Input 
                placeholder={t('postContent')}
                textArea={true}
                onChange={setContent}
            />

            <div className={styles['footer']}>
                <div className={styles['options']}>
                    <HasTooltip tooltip={t('addAttachment')}>
                        <button
                            aria-label={t('addAttachment')}
                            onClick={openAttachmentPrompt}
                            className={styles['button']}
                        >
                            <AttachmentIcon />
                            <input 
                                type="file" 
                                multiple={true}
                                aria-hidden="true"
                                onChange={addAttachments}
                                ref={attachmentRef}
                            />
                        </button>
                    </HasTooltip>
                    <Dropdown 
                        items={[
                            { text: t('visibility.all'), id: 'all' },
                            { text: t('visibility.semi'), id: 'semi' },
                            { text: t('visibility.private'), id: 'private' }
                        ]}
                        defaultActive={privacy}
                        position={'top'}
                        onChange={setPrivacy}
                    />
                </div>

                <span className={characterClassName}>
                    {content.length}/{MAX_CHARACTER_LENGTH} {t('characters')}
                </span>
            </div>

            {attachments.length !== 0 && (
                <div className={styles['attachments']}>
                    <span className={styles['label']}>
                        {t('attachments')}
                    </span>
                    <PreviewAttachments 
                        attachments={attachments}
                        onDelete={removeAttachment}
                    />
                </div>
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