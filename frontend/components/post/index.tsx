import React from 'react';
import styles from '../../styles/Post.module.scss';
import { useQueryId } from '../../hooks/useQueryId';
import { Comments } from '../comments';
import { PostMain } from './PostMain';

export const Post = React.memo(() => {
    const postId = useQueryId('postId');
    return(
        <div className={styles['container']}>
            <PostMain postId={postId} />
            <Comments postId={postId} />
        </div>
    )
});
Post.displayName = 'Post';
