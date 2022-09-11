import styles from '../../styles/Post.module.scss';

export const PostTitle: React.FC<{
    title: string;
}> = ({ title }) => {
    return(
        <h2 className={styles['title']}>
            {title}
        </h2>
    )
}