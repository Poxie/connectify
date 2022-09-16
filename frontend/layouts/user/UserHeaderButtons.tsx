import styles from '../../styles/User.module.scss';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useAppSelector } from "../../redux/store";
import { addUserFollow, removeUserFollow } from "../../redux/users/actions";
import { selectUserById } from "../../redux/users/selectors";
import Button from '../../components/button';

export const UserHeaderButtons: React.FC<{
    userId: number;
}> = ({ userId }) => {
    const dispatch = useDispatch();
    const { post, destroy } = useAuth();
    const [disabled, setDisabled] = useState(false);
    const user = useAppSelector(state => selectUserById(state, userId));
    if(!user) return null;

    const follow = () => {
        setDisabled(true);
        
        post(`/followers/${userId}/`, {'test': 'yey'})
            .then(follow => {
                setDisabled(false);
                dispatch(addUserFollow(userId));
            })
    }
    const unfollow = () => {
        setDisabled(true);
        
        destroy(`/followers/${userId}/`)
            .then(follow => {
                setDisabled(false);
                dispatch(removeUserFollow(userId));
            })
    }

    return(
        <div className={styles['header-buttons']}>
            {!user.is_self ? (
                <Button
                    onClick={user.is_following ? unfollow : follow}
                    disabled={disabled}
                    type={user.is_following ? 'secondary' : 'default'}
                >
                    {user.is_following ? 'Unfollow' : 'Follow'}
                </Button>
            ) : (
                <Button type={'secondary'}>
                    Edit Profile
                </Button>
            )}
        </div>
    )
}