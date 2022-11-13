import Image from 'next/image';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import { PostOverlay } from '../../overlays/post/PostOverlay';
import styles from '../../styles/Post.module.scss';
import { Attachment } from '../../types';

export const PostAttachment: React.FC<Attachment & {
    index: number;
}> = ({ id, extension, parent_id, index }) => {
    const { setOverlay } = useOverlay();

    const openModal = () => {
        setOverlay(
            <PostOverlay 
                postId={parent_id}
                attachmentIndex={index} 
            />
        )
    }

    return(
        <div 
            className={styles['attachment']}
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