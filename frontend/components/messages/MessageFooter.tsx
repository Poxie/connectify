import styles from '../../styles/Messages.module.scss';

export const MessageFooter: React.FC<{
    timestamp: number;
}> = ({ timestamp }) => {
    const timestampDate = new Date(timestamp * 1000);
    const diff = Date.now() / 1000 - timestamp
    const minutesAgo = diff / 60;
    const hoursAgo = (minutesAgo / 60);

    let format: Intl.RelativeTimeFormatUnit | undefined, nonRelativeTime, time;
    if(hoursAgo > 24) {
        nonRelativeTime = `${timestampDate.getMonth()}/${timestampDate.getDate()}/${timestampDate.getFullYear()}`;
    } else if(hoursAgo > 1) {
        format = 'hours';
        time = hoursAgo;
    } else if(minutesAgo > 1) {
        format = 'minutes'
        time = minutesAgo;
    } else {
        format = 'seconds';
        time = diff;
    }

    const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') || process.env.NEXT_PUBLIC_DEFAULT_LOCALE : process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
    const readableTime = format && time ? (
        new Intl.RelativeTimeFormat(locale).format(-Math.round(time), format)
    ) : nonRelativeTime;

    return(
        <span className={styles['timestamp']}>
            {readableTime}
        </span>
    )
}