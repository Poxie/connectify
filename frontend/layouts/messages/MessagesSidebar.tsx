import { useEffect } from "react";
import styles from './MessagesLayout.module.scss';
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setChannels } from "../../redux/messages/actions";
import { selectChannelIds, selectChannelsLoading } from "../../redux/messages/hooks"
import { useAppSelector } from "../../redux/store"
import { MessageSidebarChannel } from "./MessageSidebarChannel";
import { MessageSidebarChannelLoading } from "./MessageSidebarChannelLoading";
import { AddIcon } from "../../assets/icons/AddIcon";
import { useModal } from "../../contexts/modal/ModalProvider";
import { SelectUserModal } from "../../modals/select-user/SelectUserModal";

export const MessagesSidebar = () => {
    const { setModal } = useModal();
    const { get, loading } = useAuth();
    const dispatch = useDispatch();
    const channels = useAppSelector(selectChannelIds);
    const channelsLoading = useAppSelector(selectChannelsLoading);

    // Fetching message channels
    useEffect(() => {
        if(loading || channels.length) return;

        // Getting channels
        get(`/users/@me/channels`)
            .then(channels => {
                dispatch(setChannels(channels));
            })
    }, [loading, get, channels]);

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

                <div onClick={openConvoModal}>
                    <AddIcon />
                </div>
            </div>

            {channels.map(id => (
                <MessageSidebarChannel 
                    id={id}
                    key={id}
                />
            ))}
        </ul>
    )
}