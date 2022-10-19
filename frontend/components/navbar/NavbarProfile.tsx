import styles from '../../styles/Navbar.module.scss';
import Image from "next/image"
import { User } from "../../types"
import { useMenu } from '../../contexts/menu/MenuProvider';
import { useRef } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useTranslation } from 'next-i18next';

export const NavbarProfile: React.FC<User> = ({ avatar }) => {
    const { t } = useTranslation('common');
    const { profile } = useAuth();
    const { setMenu } = useMenu();
    const ref = useRef<HTMLDivElement>(null);

    const openMenu = () => {
        const logout = () => {
            localStorage.removeItem('token');
            window.location.reload();
        }

        setMenu(
            [
                [
                    { text: t('navbar.profile'), href: `/users/${profile?.id}` },
                    { text: t('navbar.settings'), href: `/settings` }
                ],
                [
                    { text: t('navbar.signOut'), onClick: logout, type: 'danger' }
                ]
            ],
            ref
        )
    }

    return(
        <div 
            className={styles['avatar']} 
            onClick={openMenu}
            ref={ref}
        >
            <Image 
                src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${avatar}`}
                width={32}
                height={32}
            />
        </div>
    )
}