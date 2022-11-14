import Image from 'next/image';
import { useRouter } from 'next/router';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import { usePhotoIndex } from '../../hooks/usePhotoIndex';
import { PostOverlay } from '../../overlays/post/PostOverlay';
import styles from './UserPost.module.scss';
import { Attachment } from '../../types';

export const UserPostAttachment: React.FC<Attachment & {
    index: number;
}> = ({ id, extension, parent_id, index }) => {
    const { setOverlay, hasOverlay } = useOverlay();
    const router = useRouter();
    const photo = usePhotoIndex();

    const openModal = async () => {
        await router.replace(router.asPath, `/posts/${parent_id}?photo=${index}`, { shallow: true })
        if(hasOverlay) return;

        const onClose = (previousPath?: string) => {
            if(!previousPath) return;
            router.replace(previousPath, undefined, { shallow: true });
        }

        setOverlay(
            <PostOverlay 
                attachmentIndex={index}
                postId={parent_id}
                key={index}
            />,
            {
                previousPath: router.asPath,
                onClose
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
                alt={`Attached image`}
                layout={'fill'}
                objectFit={'cover'}
            />
        </div>
    )
}