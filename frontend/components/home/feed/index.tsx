import styles from '../../../styles/Feed.module.scss';
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth/AuthProvider";
import { Post } from "../../../types";
import { UserPost } from "../../user-post";

export const Feed = () => {
    const { get, loading } = useAuth();
    const [feed, setFeed] = useState<Post[]>([]);

    useEffect(() => {
        if(loading) return;

        get(`/feed`)
            .then(setFeed)
    }, [get, loading]);

    return(
        <div className={styles['container']}>
            {feed.map(post => (
                <UserPost 
                    {...post}
                    key={post.id}
                />
            ))}
        </div>
    )
}