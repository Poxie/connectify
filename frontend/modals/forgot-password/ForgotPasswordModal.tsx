import { useState } from "react"
import { Input } from "../../components/input"
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useModal } from "../../contexts/modal/ModalProvider";
import { useToast } from "../../contexts/toast/ToastProvider";
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader"
import { ModalMain } from "../ModalMain";

export const ForgotPasswordModal = () => {
    const { close } = useModal();
    const { post } = useAuth();
    const { setToast } = useToast();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMail = async () => {
        setLoading(true);

        const data = await post(`/send_reset_password`, {
            email
        }).catch(error => {
            if(error.code === 401) {
                setToast(`Email is not linked with this account. Please check for typps.`, 'error');
                return;
            }
            setToast(`An error occured while sending email.`, 'error');
        }).finally(() => {
            setLoading(false);
        })
        if(!data) return;

        setToast(`An email has been sent to ${email}`, 'success');
    }

    return(
        <>
        <ModalHeader 
            subHeader={'Enter the email associated with this account to receive a link to reset your password with.'}
        >
            Reset password
        </ModalHeader>
        <ModalMain>
            <Input 
                placeholder={'Email'}
                onChange={setEmail}
                type={'email'}
            />
        </ModalMain>
        <ModalFooter 
            cancelLabel={'Close'}
            confirmLabel={'Send mail'}
            onCancel={close}
            onConfirm={sendMail}
            confirmDisabled={!email}
            confirmLoading={loading}
        />
        </>
    )
}