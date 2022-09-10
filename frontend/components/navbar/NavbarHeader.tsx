import Link from "next/link";
import styles from '../../styles/Navbar.module.scss';

export const NavbarHeader = () => {
    return(
        <Link href="/">
            <span className={styles['site-name']}>
                {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </span>
        </Link>
    )
}