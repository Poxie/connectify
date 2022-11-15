import styles from './PostOverlay.module.scss';
import { Attachment } from './Attachment';
import { Main } from './Main';
import { CloseOverlay } from './CloseOverlay';
import { useScreenType } from '../../hooks/useScreenType';

export const PostOverlay: React.FC<{
    attachmentIndex?: number;
    authorId: number;
    postId: number;
}> = ({ attachmentIndex, authorId, postId }) => {
    const screenType = useScreenType();

    return(
        <div className={styles['container']}>
            <CloseOverlay />
            <Attachment 
                postId={postId}
                authorId={authorId} 
                defaultIndex={attachmentIndex || 0} 
            />
            {['largium', 'large'].includes(screenType) && (
                <Main postId={postId} />
            )}
        </div>
    )
}