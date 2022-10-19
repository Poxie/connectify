import styles from './CreatePostModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { Input } from '../../components/input';
import { useRef, useState } from 'react';
import { ModalFooter } from '../ModalFooter';
import { useModal } from '../../contexts/modal/ModalProvider';
import { PreviewPostModal } from './PreviewPostModal';
import { useTranslation } from 'next-i18next';

export const CreatePostModal = () => {
    const { t } = useTranslation('common');
    const { close, pushModal } = useModal();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); 

    // Preview post
    const previewPost = () => {
        pushModal(
            <PreviewPostModal 
                title={title}
                content={content}
            />
        )
    }

    // Determining if post is complete
    const disabled = !title || !content;

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