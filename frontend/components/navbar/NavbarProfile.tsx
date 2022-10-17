import styles from '../../styles/Navbar.module.scss';
import Image from "next/image"
import { User } from "../../types"
import { useMenu } from '../../contexts/menu/MenuProvider';
import { useRef } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';

export const NavbarProfile: React.FC<User> = ({ avatar }) => {
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
                    { text: 'Profile', href: `/users/${profile?.id}` },
                    { text: 'Settings', href: `/settings` }
                ],
                [
                    { text: 'Log out', onClick: logout, type: 'danger' }
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