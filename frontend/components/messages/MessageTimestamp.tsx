import { useTranslation } from 'next-i18next';
import { useCurrentLocale } from '../../hooks/useCurrentLocale';
import styles from '../../styles/Messages.module.scss';

export const MessageTimestamp: React.FC<{
    timestamp: number;
}> = ({ timestamp }) => {
    const { t } = useTranslation('messages');
    const locale = useCurrentLocale();

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const date = new Date(timestamp * 1000);

    // Determining time of message
    const readableTime = date.toLocaleTimeString(locale, { minute: '2-digit', hour: '2-digit' })

    // Determining day of message
    const isToday = now.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();

    // Adding prefix to date
    let prefix;
    if(isToday) {
        prefix = t('today');
    } else if(isYesterday) {
        prefix = t('yesterday')
    } else {
        prefix = date.toLocaleString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('-', '/');
    }

    const readableDate = `${prefix} ${t('at')} ${readableTime}`;

    return(
        <span className={styles['timestamp']}>
            {readableDate}
        </span>
    )
}