import { HeartActiveIcon } from '../../assets/icons/HeartActiveIcon';
import { HeartNeutralIcon } from '../../assets/icons/HeartNeutralIcon';
import styles from './UserPost.module.scss';
import { UserPostFooterButton } from './UserPostFooterButton';

export const UserPostFooter: React.FC<{
    has_liked: boolean;
    like_count: number;
}> = ({ has_liked, like_count }) => {
    return(
        <div className={styles['footer']}>
            <UserPostFooterButton 
                onClick={console.log}
                icon={has_liked ? <HeartActiveIcon /> : <HeartNeutralIcon />}
                text={`${like_count} likes`}
            />
        </div>
    )
}