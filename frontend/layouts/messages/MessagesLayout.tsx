import styles from './MessagesLayout.module.scss';
import { ReactElement } from "react"
import { MessagesSidebar } from "./MessagesSidebar";

export const MessagesLayout: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    return(
        <div className={styles['container']}>
            <MessagesSidebar />
            {children}
        </div>
    )
}