import styles from './PostOverlay.module.scss';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { selectPostAttachments } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { ArrowIcon } from '../../assets/icons/ArrowIcon';
import { useRouter } from 'next/router';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import { HasTooltip } from '../../components/tooltip/HasTooltip';
import { useTranslation } from 'next-i18next';
import { usePhotoIndex } from '../../hooks/usePhotoIndex';

export const Attachment: React.FC<{
    defaultIndex: number;
    authorId: number;
    postId: number;
}> = ({ defaultIndex, authorId, postId }) => {
    const { t } = useTranslation('common');
    const { close } = useOverlay();
    const router = useRouter();
    const attachments = useAppSelector(state => selectPostAttachments(state, postId));
    const [active, setActive] = useState(defaultIndex);
    const currentlyActive = useRef(defaultIndex);
    
    // Updating photo index on url change, closing if not present
    const photo = usePhotoIndex();
    useEffect(() => {
        if(photo !== undefined) {
            setActive(photo);
            currentlyActive.current = photo;
        } else {
            close();
        }
    }, [photo]);

    // If attachments are removed, make sure photoId exists
    useEffect(() => {
        if(!attachments || photo === undefined) return;

        // If all attachments are removed
        if(!attachments.length) {
            close();
        }

        // If attachmentId no longer exists
        if(photo > attachments.length - 1) {
            router.replace(router.asPath, `/posts/${postId}?photo=${active - 1}`, { shallow: true });
        }
    }, [attachments?.length, photo]);

    // Allowing navigation through arrow keys
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if(e.key === 'ArrowLeft') prev();
            if(e.key === 'ArrowRight') next();
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    if(!attachments) return null;

    // Attachment navigation
    const prev = () => {
        const active = currentlyActive.current;
        if(active === 0) return prev;
        router.replace(router.asPath, `/posts/${postId}?photo=${active - 1}`, { shallow: true });
    }
    const next = () => {
        const active = currentlyActive.current;
        if(active === attachments.length - 1) return;
        router.replace(router.asPath, `/posts/${postId}?photo=${active + 1}`, { shallow: true });
    }

    const attachment = attachments[active];
    if(!attachment) return <div className={styles['attachment']} />;

    return(
        <div className={styles['attachment']}>
            {active !== 0 && (
                <HasTooltip 
                    tooltip={t('previousAttachment')} 
                    position={'right'}
                    className={styles['decrease']}
                >
                    <button 
                        onClick={prev}
                        aria-label={t('previousAttachment')}
                    >
                        <ArrowIcon />
                    </button>
                </HasTooltip>
            )}
            <Image 
                src={`${process.env.NEXT_PUBLIC_ATTACHMENT_ENDPOINT}${attachment.id}.${attachment.extension}`}
                alt={t('postAttachmentNumber', { number: active })}
                layout={'fill'}
                objectFit={'contain'}
            />
            {active !== attachments.length - 1 && (
                <HasTooltip 
                    tooltip={t('nextAttachment')} 
                    position={'left'}
                    className={styles['increase']}
                >
                    <button 
                        onClick={next}
                        aria-label={t('nextAttachment')}
                    >
                        <ArrowIcon />
                    </button>
                </HasTooltip>
            )}
        </div>
    )
}