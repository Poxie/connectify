import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Head from "next/head";
import { Post } from "../../components/post"
import { Post as PostType } from "../../types"

export default function PostPage({ post }: {
    post: PostType | undefined;
}) {
    return(
        <>
        <Head>
            <title>
                {post?.author.display_name || post?.author.username}: {post?.title} - {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </title>
            <meta property="og:description" content={post?.content} />
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_WEBSITE_NAME} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/posts/${post?.id}`} />
            <meta property="og:type" content="article" />
        </Head>

        <Post />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale, query: { postId } }) => {
    const translations = await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'post']);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts/${postId}`).catch(e => console.error('this is error:', e));
    if(!res) return {
        props: { ...translations }
    };

    const post = await res.json();

    return {
        props: {
            post,
            ...translations
        }
    }
}