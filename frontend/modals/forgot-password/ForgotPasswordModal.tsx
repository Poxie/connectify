import { useTranslation } from "next-i18next";
import React, { useState } from "react"
import { Input } from "../../components/input"
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useModal } from "../../contexts/modal/ModalProvider";
import { useToast } from "../../contexts/toast/ToastProvider";
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader"
import { ModalMain } from "../ModalMain";

export const ForgotPasswordModal = () => {
    const { t } = useTranslation('settings');
    const { t:g } = useTranslation('common');
    const { close } = useModal();
    const { post } = useAuth();
    const { setToast } = useToast();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMail = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);

        const data = await post(`/send_reset_password`, {
            email
        }).catch(error => {
            if(error.code === 401) {
                setToast(t('resetPassword.errors.incorrect'), 'error');
                return;
            }
            setToast(t('resetPassword.errors.generic'), 'error');
        }).finally(() => {
            setLoading(false);
        })
        if(!data) return;

        setToast(t('resetPassword.success', { email }), 'success');
        setEmail('');
    }

    return(
        <>
        <ModalHeader 
            subHeader={t('resetPassword.subHeader')}
        >
            {t('resetPassword.header')}
        </ModalHeader>
        <form onSubmit={sendMail}>
            <ModalMain>
                <Input 
                    placeholder={g('email')}
                    defaultValue={email}
                    onChange={setEmail}
                    type={'email'}
                />
            </ModalMain>
            <ModalFooter 
                cancelLabel={g('close')}
                confirmLabel={t('resetPassword.sendMail')}
                onCancel={close}
                onConfirm={sendMail}
                confirmDisabled={!email}
                confirmLoading={loading}
            />
        </form>
        </>
    )
}