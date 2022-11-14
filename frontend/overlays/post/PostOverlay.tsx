import styles from './PostOverlay.module.scss';
import { Attachment } from './Attachment';
import { Main } from './Main';
import { CloseOverlay } from './CloseOverlay';
import { useScreenType } from '../../hooks/useScreenType';

export const PostOverlay: React.FC<{
    postId: number;
    attachmentIndex?: number;
}> = ({ postId, attachmentIndex }) => {
    const screenType = useScreenType();
    return(
        <div className={styles['container']}>
            <CloseOverlay postId={postId} />
            <Attachment postId={postId} defaultIndex={attachmentIndex || 0} />
            {['largium', 'large'].includes(screenType) && (
                <Main postId={postId} />
            )}
        </div>
    )
}