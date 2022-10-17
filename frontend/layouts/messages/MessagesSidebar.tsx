import styles from './MessagesLayout.module.scss';
import { selectChannelIds, selectChannelsLoading } from "../../redux/messages/hooks"
import { useAppSelector } from "../../redux/store"
import { MessageSidebarChannel } from "./MessageSidebarChannel";
import { MessageSidebarChannelLoading } from "./MessageSidebarChannelLoading";
import { AddIcon } from "../../assets/icons/AddIcon";
import { useModal } from "../../contexts/modal/ModalProvider";
import { SelectUserModal } from "../../modals/select-user/SelectUserModal";
import Button from '../../components/button';
import { Tooltip } from '../../components/tooltip/Tooltip';

export const MessagesSidebar = () => {
    const { setModal } = useModal();
    const channels = useAppSelector(selectChannelIds);
    const channelsLoading = useAppSelector(selectChannelsLoading);

    // Function to open start conversation modal
    const openConvoModal = () => {
        setModal(<SelectUserModal />);
    }

    // Showing loading skeleton
    if(channelsLoading) {
        return(
            <ul className={styles['sidebar']}>
                {Array.from(Array(8)).map((_, key) => (
                    <MessageSidebarChannelLoading key={key} />
                ))}
            </ul>
        )
    }

    return(
        <ul className={styles['sidebar']}>
            <div className={styles['sidebar-header']}>
                <span>
                    Direct Messages
                </span>

                <Tooltip 
                    text={'Create conversation'}
                    onClick={openConvoModal}
                >
                    <AddIcon />
                </Tooltip>
            </div>

            {!channels.length && (
                <div className={styles['sidebar-empty']}>
                    <span>
                        You don't have any conversations yet. Start one now!
                    </span>
                    <Button 
                        className={styles['empty-button']}
                        onClick={openConvoModal}
                    >
                        Start conversation
                    </Button>
                </div>
            )}

            {channels.map(id => (
                <MessageSidebarChannel 
                    id={id}
                    key={id}
                />
            ))}
        </ul>
    )
}