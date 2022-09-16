import { ReactElement } from "react"
import { UserLayout } from "../../../layouts/user/UserLayout"
import { NextPageWithLayout } from "../../_app"

const LikedPosts: NextPageWithLayout = () => {
    return <div>liked posts</div>
}

LikedPosts.getLayout = (page: ReactElement) => (
    <UserLayout>
        {page}
    </UserLayout>
)

export default LikedPosts;