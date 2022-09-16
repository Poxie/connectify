import styles from './UserPost.module.scss';

export const UserPostTimestamp: React.FC<{
    timestamp: number;
}> = ({ timestamp }) => {
    const diff = timestamp - (Date.now() / 1000);
    const days = diff / 1000 / 60 / 60 / 24

    const timeFormater = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    let time = timeFormater.format(days, 'day');
    if(['today', 'yesteday'].includes(time)) {
        time = time.slice(0,1).toUpperCase() + time.slice(1);
        const ampmTime = new Date(timestamp * 1000).toLocaleString('en', { hour: 'numeric', minute: 'numeric', hour12: true })
        time = `${time} at ${ampmTime}`;
    } else {
        const timeFormater = new Intl.DateTimeFormat('en');
        time = timeFormater.format(timestamp * 1000);
    }
    return(
        <span className={styles['timestamp']}>
            {time}
        </span>
    )
}