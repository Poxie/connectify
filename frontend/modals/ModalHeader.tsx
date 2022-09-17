import styles from '../styles/Modal.module.scss';

export const ModalHeader: React.FC<{
    children: any;
}> = ({ children }) => {
    return(
        <h2 className={styles['header']}>
            {children}
        </h2>
    )
}