import Image from 'next/image';
import { User } from '../../types';
import styles from './SelectUserModal.module.scss';

export const SelectUserItem: React.FC<{
    user: User;
    onSelect: (user: User) => void;
}> = ({ user, onSelect }) => {
    const {id, username, display_name, avatar} = user;
    return(
        <li 
            className={styles['item']}
            onClick={() => onSelect(user)}
        >
            <button>
                <div className={styles['item-main']}>
                    <div className={styles['item-image']}>
                        {avatar && (
                            <Image 
                                src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${avatar}`}
                                width={32}
                                height={32}
                            />
                        )}
                    </div>
                    <span>
                        {display_name || username}
                    </span>
                </div>
            </button>
        </li>
    )
}