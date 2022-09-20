import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePopout } from "../../contexts/popouts/PopoutProvider";
import { UserPopout } from "../../popouts/user/UserPopout";
import { User } from "../../types"
import styles from './UserPost.module.scss';

export const UserPostAuthor: React.FC<User> = (user) => {
    const { setPopout, hoverPopout, close } = usePopout();
    const ref = useRef<HTMLAnchorElement>(null);
    const hover = useRef(hoverPopout);

    useEffect(() => {
        hover.current = hoverPopout;
    }, [hoverPopout]);
    
    const onMouseEnter = () => {
        setPopout(<UserPopout {...user} />, ref);
    }
    const onMouseLeave = () => {
        if(hover.current) return;
        close();
    }

    const { id, display_name, username, avatar } = user;
    return(
        <>
        <Link href={`/users/${id}`}>
            <a 
                className={styles['author-avatar']}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                ref={ref}
            >
                {avatar && (
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${avatar}`}
                        width={25}
                        height={25}
                    />
                )}
            </a>
        </Link>
        <Link href={`/users/${id}`}>
            <a className={styles['author-name']}>
                {display_name || username}
            </a>
        </Link>
        </>
    )
}