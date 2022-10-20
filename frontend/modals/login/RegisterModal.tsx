import styles from './LoginModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { useModal } from '../../contexts/modal/ModalProvider';
import { Input } from '../../components/input';
import Button from '../../components/button';
import { useAuth } from '../../contexts/auth/AuthProvider';
import React, { useEffect, useState } from 'react';

export const RegisterModal = () => {
    const { post } = useAuth();
    const { goBack } = useModal();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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

        post(`/users`, {
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

    // Resetting errors on typing
    useEffect(() => {
        if(!error) return;
        setError('');
    }, [username, password, repeatPassword]);

    return(
        <>
        <ModalHeader>
            Create a {process.env.NEXT_PUBLIC_WEBSITE_NAME} account
        </ModalHeader>
        <div className={styles['content']}>
            <span>
                Create an account to get the most out of the experience. Interact with others and be part of many, many features!
            </span>

            <form onSubmit={register}>
                <div className={styles['inputs']}>
                    <Input 
                        placeholder={'Useranme'}
                        name={'username'}
                        label={'Username'}
                        onChange={setUsername}
                    />
                    <Input 
                        placeholder={'Password'}
                        name={'password'}
                        label={'Password'}
                        type={'password'}
                        onChange={setPassword}
                    />
                    <Input 
                        placeholder={'Repeat password'}
                        name={'repeat-password'}
                        label={'Repeat password'}
                        type={'password'}
                        onChange={setRepeatPassword}
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
                        Already have an account?
                    </button>
                    <Button 
                        disabled={disabled}
                        buttonType={'submit'}
                    >
                        Create account
                    </Button>
                </div>
            </form>
        </div>
        </>
    )
}