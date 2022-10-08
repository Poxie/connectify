import { ReactElement } from "react"
import { MessagesLayout } from "../../layouts/messages/MessagesLayout"
import { NextPageWithLayout } from "../_app"

const MessagesChannel: NextPageWithLayout = () => {
    return(
        <div>
            channel
        </div>
    )
}

MessagesChannel.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export default MessagesChannel;