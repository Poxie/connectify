import styles from '../../styles/User.module.scss';
import { useRouter } from "next/router";
import { useAppSelector } from "../../redux/store"
import { selectUserById } from "../../redux/users/selectors"
import Button from '../button';
import { useDispatch } from 'react-redux';
import { addUserFollow, removeUserFollow } from '../../redux/users/actions';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';

export const UserHeader = () => {
    const dispatch = useDispatch();
    const { post, destroy } = useAuth();
    const [disabled, setDisabled] = useState(false);
    const { userId } = useRouter().query as { userId: string };
    const user = useAppSelector(state => selectUserById(state, parseInt(userId)));
    if(!user) return null;

    const follow = () => {
        setDisabled(true);
        
        post(`/followers/${userId}/`, {'test': 'yey'})
            .then(follow => {
                setDisabled(false);
                dispatch(addUserFollow(parseInt(userId)));
            })
    }
    const unfollow = () => {
        setDisabled(true);
        
        destroy(`/followers/${userId}/`)
            .then(follow => {
                setDisabled(false);
                dispatch(removeUserFollow(parseInt(userId)));
            })
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
                    {!user.is_self ? (
                        <Button
                            onClick={user.is_following ? unfollow : follow}
                            disabled={disabled}
                        >
                            {user.is_following ? 'Unfollow' : 'Follow'}
                        </Button>
                    ) : (
                        <Button>
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}