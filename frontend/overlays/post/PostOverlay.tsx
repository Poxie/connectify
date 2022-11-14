import styles from './PostOverlay.module.scss';
import { Attachment } from './Attachment';
import { Main } from './Main';
import { CloseOverlay } from './CloseOverlay';
import { useScreenType } from '../../hooks/useScreenType';

export const PostOverlay: React.FC<{
    attachmentIndex?: number;
}> = ({ attachmentIndex }) => {
    const screenType = useScreenType();

    return(
        <div className={styles['container']}>
            <CloseOverlay />
            <Attachment defaultIndex={attachmentIndex || 0} />
            {['largium', 'large'].includes(screenType) && (
                <Main />
            )}
        </div>
    )
}