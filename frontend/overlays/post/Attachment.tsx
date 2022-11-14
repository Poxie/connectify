import styles from './PostOverlay.module.scss';
import Image from "next/image";
import { useEffect, useState } from "react";
import { selectPostAttachments } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { ArrowIcon } from '../../assets/icons/ArrowIcon';
import { useRouter } from 'next/router';
import { useOverlay } from '../../contexts/overlay/OverlayProvider';
import { HasTooltip } from '../../components/tooltip/HasTooltip';

export const Attachment: React.FC<{
    postId: number;
    defaultIndex: number;
}> = ({ postId, defaultIndex }) => {
    const router = useRouter();
    const { close } = useOverlay();
    const attachments = useAppSelector(state => selectPostAttachments(state, postId));
    const [active, setActive] = useState(defaultIndex || 0);

    // Updating active param
    useEffect(() => {
        router.replace(`/posts/${postId}?photo=${active}`, undefined, { shallow: true });
    }, [active]);

    // Closing overlay if path changes
    useEffect(() => {
        if(!router.asPath.includes('posts')) {
            close();
        }
    }, [router.asPath]);

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
        setActive(prev => {
            if(prev === 0) return prev;
            return prev - 1;
        });
    }
    const next = () => {
        setActive(prev => {
            if(prev === attachments.length - 1) return prev;
            return prev + 1;
        });
    }

    const attachment = attachments[active];
    return(
        <div className={styles['attachment']}>
            {active !== 0 && (
                <HasTooltip 
                    tooltip={'Previous attachment'} 
                    position={'right'}
                    className={styles['decrease']}
                >
                    <button 
                        onClick={prev}
                    >
                        <ArrowIcon />
                    </button>
                </HasTooltip>
            )}
            <Image 
                src={`${process.env.NEXT_PUBLIC_ATTACHMENT_ENDPOINT}${attachment.id}.${attachment.extension}`}
                layout={'fill'}
                objectFit={'contain'}
            />
            {active !== attachments.length - 1 && (
                <HasTooltip 
                    tooltip={'Next attachment'} 
                    position={'left'}
                    className={styles['increase']}
                >
                    <button 
                        onClick={next}
                    >
                        <ArrowIcon />
                    </button>
                </HasTooltip>
            )}
        </div>
    )
}