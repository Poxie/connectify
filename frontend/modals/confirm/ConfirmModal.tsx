import { useTranslation } from "next-i18next";
import { useState } from "react";
import { ModalFooter } from "../ModalFooter";
import { ModalHeader } from "../ModalHeader"

export const ConfirmModal: React.FC<{
    header: string;
    subHeader: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}> = ({ header, subHeader, onCancel, onConfirm, cancelLabel, confirmLabel }) => {
    const { t } = useTranslation('common');
    const [loading, setLoading] = useState(false);

    const confirm = () => {
        setLoading(true);
        onConfirm();
    }

    return(
        <>
        <ModalHeader subHeader={subHeader}>
            {header}
        </ModalHeader>
        <ModalFooter 
            cancelLabel={cancelLabel || t('cancel')}
            confirmLabel={confirmLabel || t('confirm')}
            onCancel={onCancel}
            onConfirm={confirm}
            confirmLoading={loading}
        />
        </>
    )
}