import Image from 'next/image';
import { useRouter } from 'next/router';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import { PostOverlay } from '../../overlays/post/PostOverlay';
import styles from '../../styles/Post.module.scss';
import { Attachment } from '../../types';

export const PostAttachment: React.FC<Attachment & {
    index: number;
}> = ({ id, extension, parent_id, index }) => {
    const { setOverlay } = useOverlay();
    const router = useRouter();
    const { photo } = router.query as { photo?: string };

    const openModal = () => {
        const onClose = () => {
            router.replace(`/posts/${parent_id}`, undefined, { shallow: true });
        }

        setOverlay(
            <PostOverlay 
                postId={parent_id}
                attachmentIndex={index}
                key={index}
            />,
            {
                onClose
            }
        )
    }

    const className = [
        styles['attachment'],
        parseInt(photo || '') === index ? styles['active'] : ''
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