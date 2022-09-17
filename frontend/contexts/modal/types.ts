import { ReactElement } from "react"

export type ModalContext = {
    setModal: (modal: ReactElement) => void;
    close: () => void;
}