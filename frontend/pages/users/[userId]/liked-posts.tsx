import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { ReactElement } from "react"
import { LikedPosts } from "../../../components/user/LikedPosts"
import { UserLayout } from "../../../layouts/user/UserLayout"
import { NextPageWithLayout } from "../../_app"

const Liked: NextPageWithLayout = () => {
    return <LikedPosts />
}

Liked.getLayout = (page: ReactElement) => (
    <UserLayout>
        {page}
    </UserLayout>
)

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
})

export default Liked;