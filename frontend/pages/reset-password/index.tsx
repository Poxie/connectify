import styles from '../../styles/ResetPassword.module.scss';
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useToast } from '../../contexts/toast/ToastProvider';
import { useTranslation } from 'next-i18next';
import { LoginPrompt } from '../../components/login-prompt/LoginPrompt';

export const ResetPassword = () => {
    const router = useRouter();
    const { token } = router.query as { token: string };
    const { t } = useTranslation('reset-password');
    const { setToast } = useToast();
    const { post, loading, token: userToken } = useAuth();

    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => setError(''), [password, repeatedPassword]);

    // Checking if user is logged in
    if(loading) return null;
    if(!loading && !userToken) {
        return <LoginPrompt />;
    }

    const resetPassword = (e: React.FormEvent) => {
        e.preventDefault();

        if(password !== repeatedPassword) {
            setError(t('passwordsDontMatch'));
            return;
        }

        post(`/reset_password`, {
            token,
            password
        })
        .then(() => {
            router.replace(`/settings/account`);
            setToast(t('passwordResetSuccess'));
        })
        .catch(error => {
            if(error.code === 401) {
                setError(t('unauthorizedError'))
                return
            }
            setError(t('genericError'));
        })
    }

    const disabled = !password || !repeatedPassword || !!error;
    return(
        <div className={styles['container']}>
            <h2>
                {t('title')}
            </h2>
            <form onSubmit={resetPassword}>
                <Input 
                    placeholder={t('newPassword')}
                    onChange={setPassword}
                    type={'password'}
                />
                <Input 
                    placeholder={t('repeatPassword')}
                    onChange={setRepeatedPassword}
                    type={'password'}
                />
                <div className={styles['bottom']}>
                    {error && (
                        <span className={styles['error']}>
                            {error}
                        </span>
                    )}

                    <Button 
                        className={styles['button']}
                        disabled={disabled}
                        buttonType={'submit'}
                    >
                        {t('resetPassword')}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', 'reset-password']))
    }
})

export default ResetPassword;