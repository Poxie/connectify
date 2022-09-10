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

export default Home;