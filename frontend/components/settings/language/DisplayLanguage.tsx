import { useRouter } from "next/router"

export const DisplayLanguage = () => {
    const router = useRouter();
    const changeLocale = (locale: string) => {
        const { pathname, asPath, query } = router;
        router.replace({ pathname, query }, asPath, { locale });
    }

    return(
        <div>
            <span onClick={() => changeLocale('en')}>
                en
            </span>
            <span onClick={() => changeLocale('sv')}>
                sv
            </span>
        </div>
    )
}