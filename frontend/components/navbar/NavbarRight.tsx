import { useTranslation } from 'next-i18next';
import { AddIcon } from '../../assets/icons/AddIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useModal } from '../../contexts/modal/ModalProvider';
import { CreatePostModal } from '../../modals/create-post/CreatePostModal';
import styles from '../../styles/Navbar.module.scss';
import { Tooltip } from '../tooltip/Tooltip';
import { NavbarLoginButton } from './NavbarLoginButton';
import { NavbarProfile } from './NavbarProfile';

export const NavbarRight = () => {
    const { t } = useTranslation('common');
    const { loading, profile } = useAuth();
    const { setModal } = useModal();

    // Open create post modal
    const openCreatePost = () => {
        setModal(<CreatePostModal />);
    }

    // If loading profile, return null
    if(loading) return null;

    return(
        <div className={styles['right']}>
            <Tooltip 
                text={t('navbar.createPost')}
                position={'bottom'}
                className={styles['button']}
                onClick={openCreatePost}
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