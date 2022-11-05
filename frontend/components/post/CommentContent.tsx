import styles from '../../styles/Post.module.scss';

export const CommentContent: React.FC<{
    content: string;
}> = ({ content }) => {
    return(
        <span className={styles['comment-content']}>
            {content}
        </span>
    )
}