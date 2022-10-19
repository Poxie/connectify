import styles from '../../styles/User.module.scss';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useAppSelector } from "../../redux/store";
import { addUserFollow, removeUserFollow } from "../../redux/users/actions";
import { selectUserById } from "../../redux/users/selectors";
import Button from '../../components/button';
import { useModal } from '../../contexts/modal/ModalProvider';
import { EditProfileModal } from '../../modals/edit-profile/EditProfileModal';
import { useTranslation } from 'next-i18next';

export const UserHeaderButtons: React.FC<{
    userId: number;
}> = ({ userId }) => {
    const { t } = useTranslation('user');
    const dispatch = useDispatch();
    const { setModal } = useModal();
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

    // Function to open edit modal
    const editProfile = () => {
        setModal(<EditProfileModal />);
    }

    return(
        <div className={styles['header-buttons']}>
            {!user.is_self ? (
                <Button
                    onClick={user.is_following ? unfollow : follow}
                    disabled={disabled}
                    type={user.is_following ? 'secondary' : 'default'}
                    className={styles['header-button']}
                >
                    {user.is_following ? t('unfollow') : t('follow')}
                </Button>
            ) : (
                <Button 
                    type={'secondary'} 
                    onClick={editProfile}
                    className={styles['header-button']}
                >
                    {t('editProfile')}
                </Button>
            )}
        </div>
    )
}