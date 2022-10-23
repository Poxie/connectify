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

export const PreviewPostModal: React.FC<{
    title: string;
    content: string;
}> = ({ title, content }) => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const dispatch = useDispatch();
    const { profile, post } = useAuth();
    const { goBack, close } = useModal();
    const [disabled, setDisabled] = useState(false);

    const createPost = async () => {
        if(!profile) return;
        setDisabled(true);

        // Creating post
        const createdPost = await post(`/posts`, {
            content,
            title
        }).catch(() => {
            // setDisabled(false);
        })
        if(!createdPost) return;

        // Updating redux
        dispatch(setPost(createdPost));
        dispatch(addUserPostId(profile.id, createdPost.id));

        // Navigating to created post
        router.push(`/posts/${createdPost.id}`);
        close();
    }

    return(
        <>
        <ModalHeader>
            {t('previewPost')}
        </ModalHeader>

        <div className={styles['preview']}>
            <div className={styles['preview-header']}>
                <div className={styles['preview-avatar']}>
                    {profile?.avatar && (
                        <Image 
                            width={26}
                            height={26}
                            src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${profile.avatar}`}
                        />
                    )}
                </div>
                <span>
                    {profile?.display_name || profile?.username}
                </span>
                <UserPostTimestamp timestamp={Date.now() / 1000} />
            </div>

            <h3>
                {title}
            </h3>
            <p>
                {content}
            </p>
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