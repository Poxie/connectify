import styles from './UserPost.module.scss';

export const UserPostTimestamp: React.FC<{
    timestamp: number;
}> = ({ timestamp }) => {
    const diff = Date.now() / 1000 - timestamp
    const minutesAgo = diff / 60;
    const hoursAgo = (minutesAgo / 60);
    const daysAgo = (hoursAgo / 24);
    const weeksAgo = (daysAgo / 7);

    let format: Intl.RelativeTimeFormatUnit, time;
    if(daysAgo > 14) {
        format = 'weeks';
        time = weeksAgo;
    } else if(daysAgo > 1) {
        format = 'days';
        time = daysAgo;
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
    const relativeTime = new Intl.RelativeTimeFormat(locale).format(-Math.round(time), format);
    return(
        <span className={styles['timestamp']}>
            {relativeTime}
        </span>
    )
}