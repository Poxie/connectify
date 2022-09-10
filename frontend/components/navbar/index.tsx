import styles from '../../styles/Navbar.module.scss';
import { NavbarHeader } from './NavbarHeader';
import { NavbarRight } from './NavbarRight';

export const Navbar = () => {
    return(
        <header>
            <nav className={styles['content']}>
                <NavbarHeader />
                <NavbarRight />
            </nav>
        </header>
    )
}