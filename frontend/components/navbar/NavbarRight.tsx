import { AddIcon } from '../../assets/icons/AddIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import styles from '../../styles/Navbar.module.scss';
import { Tooltip } from '../tooltip/Tooltip';
import { NavbarLoginButton } from './NavbarLoginButton';
import { NavbarProfile } from './NavbarProfile';

export const NavbarRight = () => {
    const { loading, profile } = useAuth();

    // If loading profile, return null
    if(loading) return null;

    return(
        <div className={styles['right']}>
            <Tooltip 
                text={'Create post'}
                position={'bottom'}
                className={styles['button']}
            >
                <AddIcon />
            </Tooltip>

            {profile ? (
                <NavbarProfile {...profile} />
            ) : (
                <NavbarLoginButton />
            )}
        </div>
    )
}