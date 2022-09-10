import styles from './UserPost.module.scss';

export const UserPostContent: React.FC<{
    content: string;
}> = ({ content }) => {
    return(
        <span className={styles['content']}>
            {content}
        </span>
    )
}