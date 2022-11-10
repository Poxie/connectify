import styles from './LoginModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { Input } from '../../components/input';
import Button from '../../components/button';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useModal } from '../../contexts/modal/ModalProvider';
import { RegisterModal } from './RegisterModal';
import { useTranslation } from 'next-i18next';
import { TokenData } from '../../types';

export const LoginModal = () => {
    const { t } = useTranslation('common');
    const { post } = useAuth();
    const { pushModal } = useModal();
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const disabled = !username || !password || loading || !!error;

    // Function to login
    const login = (e: React.FormEvent) => {
        e.preventDefault();
        if(disabled) return;

        setLoading(true);

        // Making login request
        post<TokenData>(`/login`, {
            username,
            password
        })
        .then(data => {
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.reload();
        })
        .catch(error => {
            if(error.code === 409) {
                setError(t('invalidCredentials'));
            } else if(error.code === 500) {
                setError(t('internalError'));
            } else {
                setError(t('unknownError'));
            }
            setLoading(false);
        })
    }

    // Function to register account
    const register = () => {
        pushModal(<RegisterModal />);
    }

    // Resetting error
    useEffect(() => {
        if(!error) return;
        setError('');
    }, [username, password]);

    return(
        <>
        <ModalHeader>
            {t('loginHeader')} {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </ModalHeader>
        <div className={styles['content']}>
            <span>
                {t('loginSubHeader')}
            </span>

            <form onSubmit={login}>
                <div className={styles['inputs']}>
                    <Input 
                        placeholder={t('username')}
                        label={t('username')}
                        onChange={setUsername}
                        name={'username'}
                    />
                    <Input 
                        type={'password'}
                        placeholder={t('password')}
                        label={t('password')}
                        onChange={setPassword}
                        name={'password'}
                    />
                    {error && (
                        <span>
                            {error}
                        </span>
                    )}
                </div>

                <div className={styles['options']}>
                    <button 
                        onClick={register}
                        type={'button'}
                        className={styles['change-option']}
                    >
                        {t('alreadyHaveAnAccount')}
                    </button>
                    <Button
                        disabled={disabled}
                        buttonType={'submit'}
                    >
                        {t('signIn')}
                    </Button>
                </div>
            </form>
        </div>
        </>
    )
}