import { ReactElement } from "react"
import { HomeLayout } from "../../layouts/home/HomeLayout"
import { NextPageWithLayout } from "../_app"

const Home: NextPageWithLayout = () => {
    return(
        <div>
            Home
        </div>
    )
}
Home.getLayout = (page: ReactElement) => (
    <HomeLayout>
        {page}
    </HomeLayout>
)

export default Home;