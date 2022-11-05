import styles from '../../styles/User.module.scss';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useAppSelector } from "../../redux/store";
import { addUserFollow, removeUserFollow } from "../../redux/users/actions";
import { selectUserById, selectUserStats } from "../../redux/users/selectors";
import Button from '../../components/button';
import { useModal } from '../../contexts/modal/ModalProvider';
import { EditProfileModal } from '../../modals/edit-profile/EditProfileModal';
import { useTranslation } from 'next-i18next';
import { LoginModal } from '../../modals/login/LoginModal';

export const UserHeaderButtons: React.FC<{
    userId: number;
}> = ({ userId }) => {
    const { t } = useTranslation('user');
    const dispatch = useDispatch();
    const { setModal } = useModal();
    const { post, destroy, token } = useAuth();
    const [disabled, setDisabled] = useState(false);
    const user = useAppSelector(state => selectUserStats(state, userId));
    if(!user) return null;

    const toggleFollow = async () => {
        // If user is not logged in
        if(!token) {
            setModal(<LoginModal />);
            return;
        }

        setDisabled(true);

        // Removing following
        if(user.is_following) {
            await destroy(`/followers/${userId}/`);
            dispatch(removeUserFollow(userId));
            return setDisabled(false);
        }
        
        // Add following
        await post(`/followers/${userId}/`)
        dispatch(addUserFollow(userId));
        setDisabled(false);
    }

    // Function to open edit modal
    const editProfile = () => setModal(<EditProfileModal />);

    return(
        <div className={styles['header-buttons']}>
            {!user.is_self ? (
                <Button
                    onClick={toggleFollow}
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