import styles from '../../styles/ResetPassword.module.scss';
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useToast } from '../../contexts/toast/ToastProvider';

export const ResetPassword = () => {
    const router = useRouter();
    const { token } = router.query as { token: string };
    const { setToast } = useToast();
    const { post } = useAuth();

    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => setError(''), [password, repeatedPassword]);

    const resetPassword = () => {
        if(password !== repeatedPassword) {
            setError('Passwords don\'t match.');
            return;
        }

        post(`/reset_password`, {
            token,
            password
        })
        .then(() => {
            router.replace(`/settings/account`);
            setToast(`Successfully reset password`);
        })
        .catch(error => {
            if(error.code === 401) {
                setError('Unauthorized.')
                return
            }
            setError('An error occured.');
        })
    }

    const disabled = !password || !repeatedPassword || !!error;
    return(
        <div className={styles['container']}>
            <h2>
                Reset password
            </h2>
            <Input 
                placeholder={'New password'}
                onChange={setPassword}
                type={'password'}
            />
            <Input 
                placeholder={'Repeat password'}
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
                    onClick={resetPassword}
                >
                    Reset password
                </Button>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common']))
    }
})

export default ResetPassword;