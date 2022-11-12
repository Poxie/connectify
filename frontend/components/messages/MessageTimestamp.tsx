import styles from '../../styles/Messages.module.scss';

export const MessageTimestamp: React.FC<{
    timestamp: number;
}> = ({ timestamp }) => {
    const now = new Date();
    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1);
    const date = new Date(timestamp * 1000);

    // Determining time of message
    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const readableTime = `${hours}:${minutes} ${ampm}`;

    // Determining day of message
    const isToday = now.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();

    // Adding prefix to date
    let prefix;
    if(isToday) {
        prefix = 'Today '
    } else if(isYesterday) {
        prefix = 'Yesterday '
    } else {
        prefix = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} `;
    }

    const readableDate = `${prefix} at ${readableTime}`;

    return(
        <span className={styles['timestamp']}>
            {readableDate}
        </span>
    )
}