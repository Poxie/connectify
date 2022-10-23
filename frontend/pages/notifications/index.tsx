import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Notifications } from "../../components/notifications/Notifications"

const NotificationsPage = () => {
    return <Notifications />
}

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'notifications']))
    }
})

export default NotificationsPage;