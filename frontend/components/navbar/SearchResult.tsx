import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Navbar.module.scss'
import { User } from "../../types";

export const SearchResult: React.FC<User & {
    onFocus: () => void;
    onClick: () => void;
    onBlur: () => void;
}> = ({ id, username, display_name, avatar, follower_count, onFocus, onBlur, onClick }) => {
    const name = display_name || username;
    const showUsername = display_name !== null;
    return(
        <Link href={`/users/${id}`}>
            <a 
                className={styles['result']} 
                onFocus={onFocus}
                onClick={onClick}
                onBlur={onBlur}
            >
                <div className={styles['result-avatar']}>
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${avatar}`}
                        width={50}
                        height={50}
                    />
                </div>
                <div className={styles['result-text']}>
                    <div>
                        <span className={styles['result-name']}>
                            {display_name || username}
                        </span>
                        {showUsername && (
                            <span className={styles['result-username']}>
                                @{username}
                            </span>
                        )}
                    </div>
                    <span className={styles['result-followers']}>
                        {follower_count} followers
                    </span>
                </div>
            </a>
        </Link>
    )
}