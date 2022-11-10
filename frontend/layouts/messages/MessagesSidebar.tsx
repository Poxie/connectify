import styles from './MessagesLayout.module.scss';
import { useAppSelector } from "../../redux/store"
import { MessageSidebarChannel } from "./MessageSidebarChannel";
import { AddIcon } from "../../assets/icons/AddIcon";
import { useModal } from "../../contexts/modal/ModalProvider";
import { SelectUserModal } from "../../modals/select-user/SelectUserModal";
import Button from '../../components/button';
import { useTranslation } from 'next-i18next';
import { HasTooltip } from '../../components/tooltip/HasTooltip';
import { selectChannelIds, selectChannelsLoading } from '../../redux/messages/selectors';
import { MessagesSidebarSkeleton } from './MessagesSidebarSkeleton';

export const MessagesSidebar = () => {
    const { t } = useTranslation('messages');
    const { setModal } = useModal();
    const channelIds = useAppSelector(selectChannelIds);
    const channelsLoading = useAppSelector(selectChannelsLoading);

    const openConvoModal = () => setModal(<SelectUserModal />)

    if(channelsLoading) return <MessagesSidebarSkeleton />;

    return(
        <div className={styles['sidebar']}>
            <div className={styles['sidebar-header']}>
                <span>
                    {t('directMessages')}
                </span>

                <button 
                    onClick={openConvoModal}
                    aria-label={t('startConversation')}
                >
                    <HasTooltip 
                        tooltip={t('startConversation')}
                    >
                        <AddIcon />
                    </HasTooltip>
                </button>
            </div>

            {!channelIds.length && (
                <div className={styles['sidebar-empty']}>
                    <span>
                        {t('emptyChannels')}
                    </span>
                    <Button 
                        className={styles['empty-button']}
                        onClick={openConvoModal}
                    >
                        {t('startConversation')}
                    </Button>
                </div>
            )}

            {channelIds.length !== 0 && (
                <ul className={styles['tabs']}>
                    {channelIds.map(id => (
                        <MessageSidebarChannel 
                            id={id}
                            key={id}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}