import styles from '../../styles/Post.module.scss';

export const PostContent: React.FC<{
    content: string;
}> = ({ content }) => {
    return(
        <span className={styles['content']}>
            {content}
        </span>
    )
}