import styles from './PostOverlay.module.scss';
import { Attachment } from './Attachment';
import { Main } from './Main';
import { CloseOverlay } from './CloseOverlay';

export const PostOverlay: React.FC<{
    postId: number;
    attachmentIndex?: number;
}> = ({ postId, attachmentIndex }) => {
    return(
        <div className={styles['container']}>
            <CloseOverlay postId={postId} />
            <Attachment postId={postId} defaultIndex={attachmentIndex || 0} />
            <Main postId={postId} />
        </div>
    )
}