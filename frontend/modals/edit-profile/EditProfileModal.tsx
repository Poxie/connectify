import styles from './EditProfileModal.module.scss';
import { Modal } from "../Modal"
import { ModalHeader } from "../ModalHeader"
import { useAuth } from '../../contexts/auth/AuthProvider';
import { Input } from '../../components/input';
import { ModalFooter } from '../ModalFooter';
import { User } from '../../types';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '../../contexts/modal/ModalProvider';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/users/actions';
import { useAppSelector } from '../../redux/store';
import { selectUserById } from '../../redux/users/selectors';

export const EditProfileModal = () => {
    const { profile, patch } = useAuth();
    const { close } = useModal();
    const dispatch = useDispatch();
    const user = useAppSelector(state => selectUserById(state, profile?.id || 0));
    const [tempUser, setTempUser] = useState<User | undefined>(user);
    const [disabled, setDisabled] = useState(false);

    // Updating on object changes
    useEffect(() => {
        setTempUser(user);
    }, [user]);

    const updateProperty = (property: keyof User, value: any) => {
        if(!user) return;
        setTempUser((user: any) => {
            if(!user) return user;
            user = {...user};
            user[property] = value;
            return user;
        })
    }

    const cancel = () => {
        close();
    }
    const confirm = () => {
        if(!tempUser) return;
        setDisabled(true);

        patch(`/users/${user?.id}`, {...tempUser})
            .then(user => {
                dispatch(setUser(tempUser));
                setDisabled(false);
            })
    }

    return(
        <Modal>
            <ModalHeader>
                Edit Profile
            </ModalHeader>
            <div className={styles['banner']} />
            <div className={styles['content']}>
                <div className={styles['avatar']} />
                <div className={styles['text']}>
                    <span className={styles['name']}>
                        {tempUser?.display_name || tempUser?.username}
                    </span>
                    <span className={styles['followers']}>
                        {tempUser?.follower_count} followers
                    </span>
                </div>
            </div>
            <Input 
                labelClassName={styles['label']}
                placeholder={'Select a name to go by...'}
                label={'Display name'}
                defaultValue={tempUser?.display_name || ''}
                onChange={name => updateProperty('display_name', name)}
            />
            <Input 
                labelClassName={styles['label']}
                placeholder={'Type a few words about yourself!'}
                label={'Bio'}
                defaultValue={tempUser?.bio || ''}
            />
            <ModalFooter 
                cancelLabel={'Close'}
                onCancel={cancel}
                confirmLabel={'Save Changes'}
                onConfirm={confirm}
                disabled={disabled}
            />
        </Modal>
    )
}