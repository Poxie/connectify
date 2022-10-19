import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { ReactElement } from "react"
import { MessagesPage } from "../../components/messages/MessagesPage"
import { MessagesLayout } from "../../layouts/messages/MessagesLayout"
import { NextPageWithLayout } from "../_app"

const MessagesChannel: NextPageWithLayout = () => {
    return <MessagesPage />;
}

MessagesChannel.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'messages']))
    }
})

export default MessagesChannel;