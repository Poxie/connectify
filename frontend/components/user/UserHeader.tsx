import styles from '../../styles/User.module.scss';
import { useRouter } from "next/router";
import { useAppSelector } from "../../redux/store"
import { selectUserById } from "../../redux/users/selectors"
import Button from '../button';
import { useDispatch } from 'react-redux';
import { addUserFollow, removeUserFollow } from '../../redux/users/actions';

export const UserHeader = () => {
    const dispatch = useDispatch();
    const { userId } = useRouter().query as { userId: string };
    const user = useAppSelector(state => selectUserById(state, parseInt(userId)));
    if(!user) return null;

    const follow = () => {
        dispatch(addUserFollow(parseInt(userId)));
    }
    const unfollow = () => {
        dispatch(removeUserFollow(parseInt(userId)));
    }

    return(
        <div className={styles['header']}>
            <div className={styles['header-banner']} />

            <div className={styles['header-content']}>
                <div className={styles['header-main']}>
                    <div className={styles['header-avatar']}>
                        {/* put user avatar, when applicable */}
                    </div>
                    <div className={styles['header-text']}>
                        <h2>
                            {user.display_name || user.username}
                        </h2>
                        <span>
                            {user.follower_count} followers
                        </span>
                    </div>
                </div>
                <div className={styles['header-buttons']}>
                    <Button
                        onClick={user.is_following ? unfollow : follow}
                    >
                        {user.is_following ? 'Unfollow' : 'Follow'}
                    </Button>
                </div>
            </div>
        </div>
    )
}