import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HasTooltip } from '../../components/tooltip/HasTooltip';
import { selectChannelById, selectChannelUnreadCount } from '../../redux/messages/selectors';
import { MessageSidebarChannelBottom } from './MessageSidebarChannelBottom';
import { useAppSelector } from '../../redux/store';
import styles from './MessagesLayout.module.scss';

export const MessageSidebarChannel: React.FC<{
    id: number;
}> = ({ id }) => {
    const { t } = useTranslation('messages');
    const asPath = useRouter().asPath;
    const channel = useAppSelector(state => selectChannelById(state, id));
    const unreadCount = useAppSelector(state => selectChannelUnreadCount(state, id));
    if(!channel) return null;

    // Determining if channel is active
    const active = asPath.includes(id.toString());

    // Determining tab display
    const recipient = channel.recipients[0];
    const name = channel.name || recipient.display_name || `@${recipient.username}`;
    const username = recipient.display_name ? recipient.username : null;
    const image = channel.icon || `${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${recipient.avatar}`;
    const ariaLabel = `${name} (${t('directMessageAriaLabel')})`;

    // Creating tab className
    const className = [
        styles['tab'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <li>
            <HasTooltip 
                tooltip={name} 
                delay={500} 
                position={'right'}
            >
                <Link href={`/messages/${channel.id}`}>
                    <a className={className} aria-label={ariaLabel}>
                        <div className={styles['tab-main']}>
                            <div className={styles['tab-avatar']}>
                                <Image 
                                    src={image}
                                    layout={'fill'}
                                    objectFit={'cover'}
                                    alt={`${name} channel icon`}
                                />
                            </div>
                            <div className={styles['text']}>
                                <div className={styles['tab-text-main']}>
                                    <span className={styles['display-name']}>
                                        {name}
                                    </span>
                                    {username && (
                                        <span className={styles['username']}>
                                            @{username}
                                        </span>
                                    )}
                                </div>

                                <MessageSidebarChannelBottom channelId={id} />
                            </div>
                        </div>
                        {unreadCount !== 0 && (
                            <span className={styles['unread-count']}>
                                {unreadCount}
                            </span>
                        )}
                    </a>
                </Link>
            </HasTooltip>
        </li>
    )
}