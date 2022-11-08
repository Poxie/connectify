import { useTranslation } from 'next-i18next';
import { RefObject } from 'react';
import { AddIcon } from '../../assets/icons/AddIcon';
import { SearchIcon } from '../../assets/icons/SearchIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useModal } from '../../contexts/modal/ModalProvider';
import { useScreenType } from '../../hooks/useScreenType';
import { CreatePostModal } from '../../modals/create-post/CreatePostModal';
import { LoginModal } from '../../modals/login/LoginModal';
import styles from '../../styles/Navbar.module.scss';
import { HasTooltip } from '../tooltip/HasTooltip';
import { NavbarButton } from './NavbarButton';
import { NavbarLoginButton } from './NavbarLoginButton';
import { NavbarProfile } from './NavbarProfile';

export const NavbarRight: React.FC<{
    input: RefObject<HTMLInputElement>;
}> = ({ input }) => {
    const { t } = useTranslation('common');
    const { loading, token, profile } = useAuth();
    const { setModal } = useModal();
    const screenType = useScreenType();

    // Open create post modal
    const openCreatePost = () => {
        // If user is not logged in
        if(!token) {
            setModal(<LoginModal />);
            return;
        }

        setModal(<CreatePostModal />);
    }

    // Opening search
    const openSearch = () => {
        input.current?.focus();
    }

    // If loading profile, return null
    if(loading) return null;

    // Creating classNames
    const searchClassName = [
        styles['button'],
        styles['search-button']
    ].join(' ');
    return(
        <div className={styles['right']}>
            {['small', 'medium'].includes(screenType) && (
                <NavbarButton 
                    icon={<SearchIcon />}
                    tooltip={t('search')}
                    onClick={openSearch}
                />
            )}

            <NavbarButton 
                icon={<AddIcon />}
                tooltip={t('createPost')}
                onClick={openCreatePost}
            />

            {profile ? (
                <NavbarProfile {...profile} />
            ) : (
                <NavbarLoginButton />
            )}
        </div>
    )
}