import styles from './SelectUserModal.module.scss';
import Image from "next/image";
import { useModal } from "../../contexts/modal/ModalProvider";
import { User } from "../../types"
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader";
import { SelectedUser } from './SelectedUser';

export const SelectUserConfirmationModal: React.FC<{
    user: User;
    onConfirm: () => void;
}> = ({ user, onConfirm }) => {
    const { goBack } = useModal();

    if(!user) return null;

    return(
        <>
        <ModalHeader>
            Create conversation with {user.display_name || user.username}?
        </ModalHeader>

        <SelectedUser 
            user={user} 
            cancel={goBack} 
        />

        <ModalFooter 
            cancelLabel={'Go back'}
            onCancel={goBack}
            confirmLabel={'Create'}
            onConfirm={onConfirm}
        />
        </>
    )
}