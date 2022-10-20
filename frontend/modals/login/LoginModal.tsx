import styles from './LoginModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { Input } from '../../components/input';
import Button from '../../components/button';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthProvider';

export const LoginModal = () => {
    const { post } = useAuth();
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
        post(`/login`, {
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
                setError(error.message);
            } else if(error.code === 500) {
                setError('Internal error occured.');
            } else {
                setError('An error occured. Please try again later.');
            }
            setLoading(false);
        })
    }

    // Resetting error
    useEffect(() => {
        if(!error) return;
        setError('');
    }, [username, password]);

    return(
        <>
        <ModalHeader>
            Sign into {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </ModalHeader>
        <div className={styles['content']}>
            <span>
                Login to get the full experience. Create and interact with posts, follow users, and start conversations!
            </span>

            <form onSubmit={login}>
                <div className={styles['inputs']}>
                    <Input 
                        placeholder={'Username'}
                        label={'Username'}
                        onChange={setUsername}
                        name={'username'}
                    />
                    <Input 
                        type={'password'}
                        placeholder={'Password'}
                        label={'Password'}
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
                    <button>
                        Don't have an account?
                    </button>
                    <Button
                        disabled={disabled}
                        buttonType={'submit'}
                    >
                        Sign in
                    </Button>
                </div>
            </form>
        </div>
        </>
    )
}