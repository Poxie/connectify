import styles from '../../../styles/Language.module.scss';
import { setCookie } from 'cookies-next';
import { useRouter } from "next/router"
import { ChangeEvent } from "react";

const LOCALES = [
    { id: 'en', text: 'English' },
    { id: 'sv', text: 'Svenska' }
]
export const DisplayLanguage = () => {
    const router = useRouter();
    const changeLocale = (e: ChangeEvent<HTMLSelectElement>) => {
        const locale = e.target.value;
        const { pathname, asPath, query } = router;
        router.replace({ pathname, query }, asPath, { locale });
        localStorage.setItem('locale', locale);
        setCookie('NEXT_LOCALE', locale);
    }

    return(
        <>
            <select 
                className={styles['select']}
                onChange={changeLocale} 
                value={router.locale}
            >
                {LOCALES.map(locale => (
                    <option 
                        value={locale.id}
                        key={locale.id} 
                    >
                        {locale.text}
                    </option>
                ))}
            </select>
        </>
    )
}