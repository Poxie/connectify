import styles from './LoginModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { useModal } from '../../contexts/modal/ModalProvider';
import { Input } from '../../components/input';
import Button from '../../components/button';
import { useAuth } from '../../contexts/auth/AuthProvider';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { TokenData } from '../../types';

export const RegisterModal = () => {
    const { t } = useTranslation('common');
    const { post } = useAuth();
    const { goBack } = useModal();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const disabled = !username || !password || !repeatPassword || !!error || loading;

    // Function to create account
    const register = (e: React.FormEvent) => {
        e.preventDefault();

        if(disabled) return;
        if(password !== repeatPassword) {
            setError('Passwords don\'t match.');
            return;
        }

        setLoading(true);

        post<TokenData>(`/users`, {
            username,
            password,
            email
        })
        .then(data => {
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.reload();
        })
        .catch(error => {
            if(error.code === 409) {
                setError(error.message);
            } else if(error.code === 500) {
                setError('Internal error occured.');
            } else {
                setError('An error occured. Please try again later.');
            }
            setLoading(false);
        })
    }

    // Resetting errors on typing
    useEffect(() => {
        if(!error) return;
        setError('');
    }, [username, password, repeatPassword]);

    return(
        <>
        <ModalHeader>
            {t('registerHeader', {websiteName: process.env.NEXT_PUBLIC_WEBSITE_NAME})}
        </ModalHeader>
        <div className={styles['content']}>
            <span>
                {t('registerSubHeader')}
            </span>

            <form onSubmit={register}>
                <div className={styles['inputs']}>
                    <Input 
                        placeholder={t('username')}
                        label={t('username')}
                        name={'username'}
                        onChange={setUsername}
                    />
                    <Input 
                        placeholder={t('password')}
                        label={t('password')}
                        name={'password'}
                        type={'password'}
                        onChange={setPassword}
                    />
                    <Input 
                        placeholder={t('repeatPassword')}
                        label={t('repeatPassword')}
                        name={'repeat-password'}
                        type={'password'}
                        onChange={setRepeatPassword}
                    />
                    <Input 
                        placeholder={t('email')}
                        label={t('emailLabel')}
                        name={'email'}
                        onChange={setEmail}
                    />

                    {error && (
                        <span>
                            {error}
                        </span>
                    )}
                </div>

                <div className={styles['options']}>
                    <button 
                        onClick={goBack}
                        type={'button'}
                        className={styles['change-option']}
                    >
                        {t('alreadyHaveAnAccount')}
                    </button>
                    <Button 
                        disabled={disabled}
                        buttonType={'submit'}
                    >
                        {t('createAccount')}
                    </Button>
                </div>
            </form>
        </div>
        </>
    )
}