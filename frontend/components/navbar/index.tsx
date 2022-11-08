import { useRef } from 'react';
import styles from '../../styles/Navbar.module.scss';
import { NavbarHeader } from './NavbarHeader';
import { NavbarInput } from './NavbarInput';
import { NavbarRight } from './NavbarRight';

export const Navbar = () => {
    const input = useRef<HTMLInputElement>(null);
    return(
        <header className={styles['container']}>
            <nav className={styles['content']}>
                <NavbarHeader />
                <NavbarInput inputRef={input} />
                <NavbarRight input={input} />
            </nav>
        </header>
    )
}