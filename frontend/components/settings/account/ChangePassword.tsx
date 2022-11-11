import React, { useEffect, useState } from "react"
import styles from '../../../styles/Account.module.scss';
import { useAuth } from "../../../contexts/auth/AuthProvider";
import { useToast } from "../../../contexts/toast/ToastProvider";
import Button from "../../button";
import { Input } from "../../input"
import { useTranslation } from "next-i18next";

export const ChangePassword = () => {
    const { t } = useTranslation('settings');
    const { patch, profile } = useAuth();
    const { setToast } = useToast();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => setError(''), [currentPassword, newPassword]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentPassword || !newPassword) return;

        patch(`/users/${profile?.id}`, {
            password: currentPassword,
            new_password: newPassword
        })
        .then(() => {
            setToast('passwordUpdatedSuccess', 'success');
            setCurrentPassword('');
            setNewPassword('');
        })
        .catch(error => {
            if(error.code === 401) {
                setError(t('passwordIsIncorrect'));
            }
        })
    }
    
    const disabled = !currentPassword || !newPassword || !!error;
    return(
        <form 
            onSubmit={onSubmit}
            className={styles['change-password']}
        >
            <Input 
                placeholder={t('currentPassword')}
                onChange={setCurrentPassword}
                defaultValue={currentPassword}
                containerClassName={styles['input']}
            />
            <Input 
                placeholder={t('newPassword')}
                onChange={setNewPassword}
                defaultValue={newPassword}
                containerClassName={styles['input']}
            />
            
            <div className={styles['bottom']}>
                {error && (
                    <span className={styles['error']}>
                        {error}
                    </span>
                )}

                <Button
                    disabled={disabled}
                    buttonType={'submit'}
                    className={styles['button']}
                >
                    {t('updatePassword')}
                </Button>
            </div>
        </form>
    )
}