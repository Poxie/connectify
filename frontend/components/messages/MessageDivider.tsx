import styles from '../../styles/Messages.module.scss';
import { useCurrentLocale } from "../../hooks/useCurrentLocale";

export const MessageDivider: React.FC<{
    timestamp: number;
}> = ({ timestamp }) => {
    const locale = useCurrentLocale();
    const date = new Date(timestamp * 1000);
    const fullDate = date.toLocaleString(locale, { dateStyle: 'long' });
    
    return(
        <div className={styles['divider']}>
            <span>
                {fullDate}
            </span>
        </div>
    )
}