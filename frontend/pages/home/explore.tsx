import { ReactElement } from "react";
import { HomeLayout } from "../../layouts/home/HomeLayout";
import { NextPageWithLayout } from "../_app";

const Explore: NextPageWithLayout = () => {
    return(
        <div>
            explore
        </div>
    )
}
Explore.getLayout = (page: ReactElement) => (
    <HomeLayout>
        {page}
    </HomeLayout>
)

export default Explore;