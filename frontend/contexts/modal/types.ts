import { ReactElement } from "react"

export type ModalContext = {
    setModal: (modal: ReactElement) => void;
    pushModal: (modal: ReactElement) => void;
    goBack: () => void;
    close: () => void;
}