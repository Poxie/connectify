import Link from "next/link";
import styles from '../../styles/Navbar.module.scss';

export const NavbarHeader = () => {
    return(
        <div>
            <Link href="/home">
                <a className={styles['site-name']}>
                    {process.env.NEXT_PUBLIC_WEBSITE_NAME}
                </a>
            </Link>
        </div>
    )
}