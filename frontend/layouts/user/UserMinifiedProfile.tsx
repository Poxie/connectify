import styles from '../../styles/User.module.scss';
import { useQueryId } from "../../hooks/useQueryId"
import { useAppSelector } from "../../redux/store";
import { selectUserDisplay } from "../../redux/users/selectors";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UserHeaderButtons } from './UserHeaderButtons';

export const UserMinifiedProfile = () => {
    const userId = useQueryId('userId');
    const user = useAppSelector(state => selectUserDisplay(state, userId));
    const name = user?.display_name || user?.username;
    if(!userId) return null;

    const goToProfile = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return(
        <motion.div
            initial={{ translateY: 40, opacity: 0 }}
            exit={{ translateY: 40, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            className={styles['minified-profile']}
        >
            <button 
                className={styles['minified-main']} 
                onClick={goToProfile}
            >
                <div className={styles['minified-avatar']}>
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${user?.avatar}`}
                        alt={`${name}'s avatar`}
                        width={32}
                        height={32}
                    />
                </div>
                <span className={styles['minified-name']}>
                    {name}
                </span>
            </button>
            <UserHeaderButtons userId={userId} />
        </motion.div>
    )
}