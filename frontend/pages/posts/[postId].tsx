import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Post } from "../../components/post"

export default function PostPage() {
    return <Post />
}

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
})