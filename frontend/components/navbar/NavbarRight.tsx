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
import { NavbarLoginButton } from './NavbarLoginButton';
import { NavbarProfile } from './NavbarProfile';

export const NavbarRight: React.FC<{
    inputContainer: RefObject<HTMLDivElement>;
}> = ({ inputContainer }) => {
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
        inputContainer.current?.classList?.toggle(styles['active']);
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
            <button 
                tabIndex={['small', 'medium'].includes(screenType) ? undefined : -1}
                onClick={openSearch}
                aria-label={t('search')}
            >
                <HasTooltip
                    tooltip={t('search')}
                    position={'bottom'}
                    className={searchClassName}
                >
                    <SearchIcon />
                </HasTooltip>
            </button>

            <button 
                onClick={openCreatePost}
                aria-label={t('createPost')}
            >
                <HasTooltip 
                    tooltip={t('navbar.createPost')}
                    position={'bottom'}
                    className={styles['button']}
                >
                    <AddIcon />
                </HasTooltip>
            </button>

            {profile ? (
                <NavbarProfile {...profile} />
            ) : (
                <NavbarLoginButton />
            )}
        </div>
    )
}