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
import { UserStats } from '../../layouts/user/UserStats';
import { useToast } from '../../contexts/toast/ToastProvider';

export const EditProfileModal = () => {
    const { t } = useTranslation('user');
    const { t:g } = useTranslation('common');
    const { profile, patch } = useAuth();
    const { close } = useModal();
    const { setToast } = useToast();
    const dispatch = useDispatch();
    const user = useAppSelector(state => selectUserById(state, profile?.id || 0));
    const [tempUser, setTempUser] = useState(user);
    const [loading, setLoading] = useState(false);
    if(!user || !tempUser) return null;

    const updateProperty = (property: keyof User, value: any) => {
        setTempUser(prev => {
            if(!prev) return prev;

            const user = {...prev, ...{
                [property]: value
            }}
            return user;
        });
    }

    const cancel = close;
    const confirm = async () => {
        // Checking what properties to update
        const propertiesToUpdate: Partial<User> = {};
        Object.entries(tempUser).forEach(([prop, value]: [prop: any, value: any]) => {
            if(user[prop as keyof User] !== value) {
                propertiesToUpdate[prop as keyof User] = value;
            }
        })

        // If no changes have been made
        if(!Object.keys(propertiesToUpdate).length) {
            return setToast(t('editProfile.noChanges'), 'info');
        }

        setLoading(true);

        const newUser = await patch<User>(`/users/${user.id}`, propertiesToUpdate)
            .catch(error => {
                setToast(t('editProfile.error'), 'error');
            })
            .finally(() => {
                setLoading(false);
            });

        if(!newUser) return;

        const userToUpdate = {...tempUser};
        
        // Checking if banner or avatar is of type file
        if(userToUpdate.avatar instanceof File) userToUpdate.avatar = newUser.avatar;
        if(userToUpdate.banner instanceof File) userToUpdate.banner = newUser.banner;

        dispatch(setUser(userToUpdate));
        setTempUser(userToUpdate);
        setToast(t('editProfile.success'), 'success');
    }

    const { username, bio, banner, avatar, display_name } = tempUser;
    return(
        <>
            <ModalHeader>
                {t('editProfile.header')}
            </ModalHeader>
            <EditProfileBanner 
                updateProperty={updateProperty}
                banner={banner || null}
            />
            <div className={styles['content']}>
                <EditProfileAvatar 
                    updateProperty={updateProperty}
                    avatar={avatar || null}
                />

                <div className={styles['text']}>
                    <span className={styles['name']}>
                        {display_name || username}
                    </span>
                    {bio && (
                        <span className={styles['bio']}>
                            {bio}
                        </span>
                    )}
                    <UserStats userId={user?.id as number} />
                </div>
            </div>
            <div className={styles['input-container']}>
                <Input 
                    labelClassName={styles['label']}
                    placeholder={t('editProfile.displayNamePlaceholder')}
                    label={t('editProfile.displayName')}
                    defaultValue={display_name || ''}
                    onChange={name => updateProperty('display_name', name)}
                />
                <Input 
                    labelClassName={styles['label']}
                    placeholder={t('editProfile.bioPlaceholder')}
                    label={'Bio'}
                    defaultValue={bio || ''}
                    onChange={bio => updateProperty('bio', bio)}
                    textArea={true}
                />
            </div>
            <ModalFooter 
                cancelLabel={g('close')}
                onCancel={cancel}
                confirmLabel={g('saveChanges')}
                onConfirm={confirm}
                confirmLoading={loading}
            />
        </>
    )
}