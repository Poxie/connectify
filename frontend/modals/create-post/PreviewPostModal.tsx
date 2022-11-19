import styles from './CreatePostModal.module.scss';
import { useAuth } from "../../contexts/auth/AuthProvider";
import { ModalHeader } from "../ModalHeader"
import { ModalFooter } from '../ModalFooter';
import { useModal } from '../../contexts/modal/ModalProvider';
import Image from 'next/image';
import { UserPostTimestamp } from '../../components/user-post/UserPostTimestamp';
import { useDispatch } from 'react-redux';
import { setPost } from '../../redux/posts/actions';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { addUserPostId } from '../../redux/users/actions';
import { useTranslation } from 'next-i18next';
import { Post } from '../../types';
import { useToast } from '../../contexts/toast/ToastProvider';
import { TempAttachment } from './CreatePostModal';
import { PreviewAttachments } from './PreviewAttachments';

export const PreviewPostModal: React.FC<{
    title: string;
    content: string;
    privacy: string;
    attachments: TempAttachment[];
}> = ({ title, content, privacy, attachments }) => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const dispatch = useDispatch();
    const { setToast } = useToast();
    const { profile, post } = useAuth();
    const { goBack, close } = useModal();
    const [disabled, setDisabled] = useState(false);

    const createPost = async () => {
        if(!profile) return;
        setDisabled(true);

        // Creating post
        const createdPost = await post<Post>(`/posts`, {
            content,
            title,
            privacy,
            attachments: attachments.map(attachment => attachment.file)
        }).catch(() => {
            setDisabled(false);
            setToast(t('postCreateError'), 'error');
        })
        if(!createdPost) return;

        // Updating redux
        dispatch(setPost(createdPost));
        dispatch(addUserPostId(profile.id, createdPost.id));

        // Navigating to created post
        router.push(`/posts/${createdPost.id}`);
        close();
    }

    const author = profile?.display_name || profile?.username;
    return(
        <>
        <ModalHeader>
            {t('previewPost')}
        </ModalHeader>

        <div className={styles['preview']}>
            <div className={styles['preview-header']}>
                <div className={styles['preview-avatar']}>
                    <Image 
                        width={26}
                        height={26}
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${profile?.avatar}`}
                        alt={`${author}'s avatar`}
                    />
                </div>
                <span>
                    {author}
                </span>
                <UserPostTimestamp timestamp={Date.now() / 1000} />
            </div>

            <h3>
                {title}
            </h3>
            <p>
                {content}
            </p>

            <PreviewAttachments attachments={attachments} />
        </div>

        <ModalFooter 
            cancelLabel={t('goBack')}
            onCancel={goBack}
            confirmLabel={t('createPost')}
            onConfirm={createPost}
            confirmLoading={disabled}
        />
        </>
    )
}