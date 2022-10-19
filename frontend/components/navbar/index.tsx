import { useRef } from 'react';
import styles from '../../styles/Navbar.module.scss';
import { NavbarHeader } from './NavbarHeader';
import { NavbarInput } from './NavbarInput';
import { NavbarRight } from './NavbarRight';

export const Navbar = () => {
    const inputContainer = useRef<HTMLDivElement>(null);
    return(
        <header className={styles['container']}>
            <nav className={styles['content']}>
                <NavbarHeader />
                <NavbarInput ref={inputContainer} />
                <NavbarRight inputContainer={inputContainer} />
            </nav>
        </header>
    )
}