import { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Head from "next/head"
import { ReactElement } from "react"
import { MessagesPage } from "../../components/messages/MessagesPage"
import { useQueryId } from "../../hooks/useQueryId"
import { MessagesLayout } from "../../layouts/messages/MessagesLayout"
import { selectChannelName } from "../../redux/messages/selectors"
import { useAppSelector } from "../../redux/store"
import { NextPageWithLayout } from "../_app"

const MessagesChannel: NextPageWithLayout = () => {
    const { t } = useTranslation('messages');
    const channelId = useQueryId('channelId');
    const channelName = useAppSelector(state => selectChannelName(state, channelId));

    return(
        <>
        <Head>
            <title>
                {channelName || t('title')} - {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </title>
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/messages/${channelId}`} />
        </Head>

        <MessagesPage />
        </>
    )
}

MessagesChannel.getLayout = (page: ReactElement) => (
    <MessagesLayout>
        {page}
    </MessagesLayout>
)

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'messages']))
    }
})

export default MessagesChannel;