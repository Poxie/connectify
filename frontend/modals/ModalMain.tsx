import styles from '../styles/Modal.module.scss';
import { ReactElement } from "react"

export const ModalMain: React.FC<{
    children: ReactElement | ReactElement[];
}> = ({ children }) => {
    return(
        <div className={styles['main']}>
            {children}
        </div>
    )
}