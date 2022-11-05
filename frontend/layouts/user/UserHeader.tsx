import { useQueryId } from '../../hooks/useQueryId';
import { useRequest } from '../../hooks/useRequest';
import { useAppSelector } from '../../redux/store';
import { setUser } from '../../redux/users/actions';
import { selectUserDisplay } from '../../redux/users/selectors';
import styles from '../../styles/User.module.scss';
import { UserHeaderButtons } from "./UserHeaderButtons";
import { UserHeaderMain } from './UserHeaderMain';
import { UserHeaderSkeleton } from './UserHeaderSkeleton';

export const UserHeader = () => {
    const userId = useQueryId('userId');
    const user = useAppSelector(state => selectUserDisplay(state, userId));
    useRequest(`/users/${userId}`, setUser, !user);

    if(!user) return <UserHeaderSkeleton />;

    return(
        <div className={styles['header']}>
            <div 
                className={styles['header-banner']} 
                style={{
                    backgroundImage: user.banner ? `url(${process.env.NEXT_PUBLIC_BANNER_ENDPOINT}${user.banner})` : undefined
                }}
            />

            <div className={styles['header-content']}>
                <UserHeaderMain {...user} />
                <UserHeaderButtons userId={userId} />
            </div>
        </div>
    )
}