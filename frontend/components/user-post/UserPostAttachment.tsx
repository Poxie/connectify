import Image from 'next/image';
import { useRouter } from 'next/router';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import { usePhotoIndex } from '../../hooks/usePhotoIndex';
import { PostOverlay } from '../../overlays/post/PostOverlay';
import styles from './UserPost.module.scss';
import { Attachment } from '../../types';
import { useTranslation } from 'next-i18next';

export const UserPostAttachment: React.FC<Attachment & {
    index: number;
}> = ({ id, extension, parent_id, index }) => {
    const { t } = useTranslation('common');
    const { setOverlay, hasOverlay } = useOverlay();
    const router = useRouter();
    const photo = usePhotoIndex();

    const openModal = async () => {
        const method = hasOverlay ? router.replace : router.push;
        await method(router.asPath, `/posts/${parent_id}?photo=${index}`, { shallow: true })
        if(hasOverlay) return;

        const onEscape = () => router.back();

        setOverlay(
            <PostOverlay 
                attachmentIndex={index}
                key={index}
            />,
            {
                onEscape
            }
        )
    }

    const className = [
        styles['attachment'],
        photo === index ? styles['active'] : ''
    ].join(' ');
    return(
        <div 
            className={className}
            onClick={openModal}
        >
            <Image 
                src={`${process.env.NEXT_PUBLIC_ATTACHMENT_ENDPOINT}${id}.${extension}`}
                alt={t('attachedImage')}
                layout={'fill'}
                objectFit={'cover'}
            />
        </div>
    )
}