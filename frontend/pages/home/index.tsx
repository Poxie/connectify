import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { ReactElement } from "react"
import { Feed } from "../../components/home/feed"
import { HomeLayout } from "../../layouts/home/HomeLayout"
import { NextPageWithLayout } from "../_app"

const Home: NextPageWithLayout = () => {
    return <Feed />
}
Home.getLayout = (page: ReactElement) => (
    <HomeLayout>
        {page}
    </HomeLayout>
)

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home']))
    }
})

export default Home;