import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home']))
    }
})

export default Explore;