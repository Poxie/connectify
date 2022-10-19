import styles from './SelectUserModal.module.scss';
import Image from "next/image";
import { useModal } from "../../contexts/modal/ModalProvider";
import { User } from "../../types"
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader";
import { SelectedUser } from './SelectedUser';
import { useTranslation } from 'next-i18next';

export const SelectUserConfirmationModal: React.FC<{
    user: User;
    onConfirm: () => void;
}> = ({ user, onConfirm }) => {
    const { t } = useTranslation('common');
    const { goBack } = useModal();

    if(!user) return null;

    return(
        <>
        <ModalHeader>
            {t('createConversationWith')} {user.display_name || user.username}?
        </ModalHeader>

        <SelectedUser 
            user={user} 
            cancel={goBack} 
        />

        <ModalFooter 
            cancelLabel={t('goBack')}
            onCancel={goBack}
            confirmLabel={t('create')}
            onConfirm={onConfirm}
        />
        </>
    )
}