import styles from '../../styles/Messages.module.scss';
import { ReactElement } from "react";
import { MessagesLayout } from "../../layouts/messages/MessagesLayout";
import { NextPageWithLayout } from "../_app";
import Button from '../../components/button';

const Messages: NextPageWithLayout = () => {
    return(
        <div className={styles['empty']}>
            <h2>
                Choose a direct message
            </h2>
            <span>
                Choose an existing direct message or create a new one.
            </span>
            <Button className={styles['conversation-button']}>
                Start conversation
            </Button>
        </div>
    )
}

Messages.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export default Messages;