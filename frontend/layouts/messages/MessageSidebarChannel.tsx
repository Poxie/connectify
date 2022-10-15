import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { selectChannelById, selectChannelUnreadCount } from '../../redux/messages/hooks';
import { useAppSelector } from '../../redux/store';
import { MessagesSidebarTyping } from './MessageSidebarTyping';
import styles from './MessagesLayout.module.scss';

export const MessageSidebarChannel: React.FC<{
    id: number;
}> = ({ id }) => {
    const asPath = useRouter().asPath;
    const channel = useAppSelector(state => selectChannelById(state, id));
    const unreadCount = useAppSelector(state => selectChannelUnreadCount(state, id));
    if(!channel) return null;

    // Determining if channel is active
    const active = asPath.includes(id.toString());

    // Determining tab display
    const recipient = channel.recipients[0];
    const name = channel.name || recipient.display_name || recipient.username
    const image = channel.icon || `${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${recipient.avatar}`;
    const ariaLabel = `${name} (direct message)`;

    // Creating tab className
    const className = [
        styles['tab'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <li>
            <Link href={`/messages/${channel.id}`}>
                <a className={className} aria-label={ariaLabel}>
                    <div className={styles['tab-main']}>
                        <div className={styles['tab-avatar']}>
                            {image && (
                                <Image 
                                    src={image}
                                    layout={'fill'}
                                    objectFit={'cover'}
                                />
                            )}
                        </div>
                        <div className={styles['text']}>
                            <span>
                                {name}
                            </span>
                            <MessagesSidebarTyping channelId={id} />
                        </div>
                    </div>
                    {unreadCount !== 0 && (
                        <span className={styles['unread-count']}>
                            {unreadCount}
                        </span>
                    )}
                </a>
            </Link>
        </li>
    )
}