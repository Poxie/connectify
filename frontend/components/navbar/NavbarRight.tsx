import { useAuth } from '../../contexts/auth/AuthProvider';
import styles from '../../styles/Navbar.module.scss';
import { NavbarLoginButton } from './NavbarLoginButton';
import { NavbarProfile } from './NavbarProfile';

export const NavbarRight = () => {
    const { loading, profile } = useAuth();

    // If loading profile, return null
    if(loading) return null;

    return(
        <div className={styles['right']}>
            {profile ? (
                <NavbarProfile {...profile} />
            ) : (
                <NavbarLoginButton />
            )}
        </div>
    )
}