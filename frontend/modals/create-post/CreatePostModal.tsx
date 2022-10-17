import styles from './CreatePostModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { Input } from '../../components/input';
import { useRef, useState } from 'react';
import { ModalFooter } from '../ModalFooter';
import { useModal } from '../../contexts/modal/ModalProvider';
import { PreviewPostModal } from './PreviewPostModal';

export const CreatePostModal = () => {
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
            Create post
        </ModalHeader>
        <div className={styles['content']}>
            <Input 
                placeholder={'Title'}
                onChange={setTitle}
            />
            <Input 
                placeholder={'Content'}
                textArea={true}
                onChange={setContent}
            />
        </div>
        <ModalFooter 
            cancelLabel={'Cancel'}
            onCancel={close}
            confirmLabel={'Preview'}
            onConfirm={previewPost}
            confirmDisabled={disabled}
        />
        </>
    )
}