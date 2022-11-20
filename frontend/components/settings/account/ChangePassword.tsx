import React, { useEffect, useState } from "react"
import styles from '../../../styles/Account.module.scss';
import { useAuth } from "../../../contexts/auth/AuthProvider";
import { useToast } from "../../../contexts/toast/ToastProvider";
import Button from "../../button";
import { Input } from "../../input"
import { useTranslation } from "next-i18next";
import { useModal } from "../../../contexts/modal/ModalProvider";
import { ForgotPasswordModal } from "../../../modals/forgot-password/ForgotPasswordModal";

export const ChangePassword = () => {
    const { t } = useTranslation('settings');
    const { patch, profile } = useAuth();
    const { setToast } = useToast();
    const { setModal } = useModal();

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
            setToast(t('account.success'), 'success');
            setCurrentPassword('');
            setNewPassword('');
        })
        .catch(error => {
            if(error.code === 401) {
                setError(t('account.errors.mailIncorrect'));
            }
        })
    }

    const openForgotPasswordModal = () => {
        setModal(<ForgotPasswordModal />)
    }
    
    const disabled = !currentPassword || !newPassword || !!error;
    return(
        <form 
            onSubmit={onSubmit}
            className={styles['change-password']}
        >
            <Input 
                placeholder={t('account.currentPassword')}
                onChange={setCurrentPassword}
                defaultValue={currentPassword}
                containerClassName={styles['input']}
                type={'password'}
            />
            <Input 
                placeholder={t('account.newPassword')}
                onChange={setNewPassword}
                defaultValue={newPassword}
                containerClassName={styles['input']}
                type={'password'}
            />
            
            <div className={styles['bottom']}>
                {error && (
                    <span className={styles['error']}>
                        {error}
                    </span>
                )}

                <div className={styles['options']}>
                    <button 
                        className={styles['forgot-password']}
                        onClick={openForgotPasswordModal}
                        type={'button'}
                    >
                        {t('account.forgotPassword')}
                    </button>
                    <Button
                        disabled={disabled}
                        buttonType={'submit'}
                    >
                        {t('account.updatePassword')}
                    </Button>
                </div>
            </div>
        </form>
    )
}