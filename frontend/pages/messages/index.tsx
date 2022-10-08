import { ReactElement } from "react";
import { MessagesLayout } from "../../layouts/messages/MessagesLayout";
import { NextPageWithLayout } from "../_app";

const Messages: NextPageWithLayout = () => {
    return(
        <div>
            messages
        </div>
    )
}

Messages.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export default Messages;