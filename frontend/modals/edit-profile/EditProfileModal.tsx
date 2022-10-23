import styles from './EditProfileModal.module.scss';
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
import { EditProfileBanner } from './EditProfileBanner';
import { EditProfileAvatar } from './EditProfileAvatar';
import { useTranslation } from 'next-i18next';

export const EditProfileModal = () => {
    const { t } = useTranslation('common');
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

        // Updating temporary properties
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

        // Updating user
        patch(`/users/${user?.id}`, {...tempUser})
            .then(user => {
                // Making sure not to dispatch user object with file value
                if(tempUser.banner instanceof File) {
                    tempUser.banner = user.banner;
                }
                if(tempUser.avatar instanceof File) {
                    tempUser.avatar = user.avatar;
                }

                dispatch(setUser(tempUser));
                setDisabled(false);
            })
    }

    return(
        <>
            <ModalHeader>
                {t('editProfile')}
            </ModalHeader>
            <EditProfileBanner 
                updateProperty={updateProperty}
                banner={tempUser?.banner || null}
            />
            <div className={styles['content']}>
                <EditProfileAvatar 
                    updateProperty={updateProperty}
                    avatar={tempUser?.avatar || null}
                />

                <div className={styles['text']}>
                    <span className={styles['name']}>
                        {tempUser?.display_name || tempUser?.username}
                    </span>
                    {tempUser?.bio && (
                        <span className={styles['bio']}>
                            {tempUser.bio}
                        </span>
                    )}
                    <span className={styles['followers']}>
                        {tempUser?.follower_count} {t('followers')}
                    </span>
                </div>
            </div>
            <div className={styles['input-container']}>
                <Input 
                    labelClassName={styles['label']}
                    placeholder={t('displayNamePlaceholder')}
                    label={t('displayName')}
                    defaultValue={tempUser?.display_name || ''}
                    onChange={name => updateProperty('display_name', name)}
                />
                <Input 
                    labelClassName={styles['label']}
                    placeholder={t('bioPlaceholder')}
                    label={'Bio'}
                    defaultValue={tempUser?.bio || ''}
                    onChange={bio => updateProperty('bio', bio)}
                    textArea={true}
                />
            </div>
            <ModalFooter 
                cancelLabel={t('close')}
                onCancel={cancel}
                confirmLabel={t('saveChanges')}
                onConfirm={confirm}
                confirmLoading={disabled}
            />
        </>
    )
}