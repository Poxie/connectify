import { useTranslation } from 'next-i18next';
import { RefObject } from 'react';
import { AddIcon } from '../../assets/icons/AddIcon';
import { SearchIcon } from '../../assets/icons/SearchIcon';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useModal } from '../../contexts/modal/ModalProvider';
import { CreatePostModal } from '../../modals/create-post/CreatePostModal';
import styles from '../../styles/Navbar.module.scss';
import { Tooltip } from '../tooltip/Tooltip';
import { NavbarLoginButton } from './NavbarLoginButton';
import { NavbarProfile } from './NavbarProfile';

export const NavbarRight: React.FC<{
    inputContainer: RefObject<HTMLDivElement>;
}> = ({ inputContainer }) => {
    const { t } = useTranslation('common');
    const { loading, profile } = useAuth();
    const { setModal } = useModal();

    // Open create post modal
    const openCreatePost = () => {
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
            <Tooltip
                text={t('search')}
                position={'bottom'}
                className={searchClassName}
                onClick={openSearch}
            >
                <SearchIcon />
            </Tooltip>

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