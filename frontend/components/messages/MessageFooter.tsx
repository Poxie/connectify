import styles from '../../styles/Messages.module.scss';

export const MessageFooter: React.FC<{
    timestamp: number;
}> = ({ timestamp }) => {
    const date = new Date(timestamp * 1000);

    const month = date.toLocaleString('default', { month: 'short' });
    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
    if(minutes < 10) minutes = `0${minutes}`
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const readableTime = `${date.getDate()} ${month}, ${date.getFullYear()} ${hours}:${minutes} ${ampm}`;

    return(
        <span className={styles['timestamp']}>
            {readableTime}
        </span>
    )
}