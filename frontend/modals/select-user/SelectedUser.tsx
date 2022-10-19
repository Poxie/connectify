import styles from './SelectUserModal.module.scss';
import { User } from "../../types"
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

export const SelectedUser: React.FC<{
    user: User;
    cancel: () => void;
}> = ({ user, cancel }) => {
    const { t } = useTranslation('common');
    return(
        <div className={styles['selected']}>
            <div className={styles['selected-main']}>
                <div className={styles['selected-avatar']}>
                    {user.avatar && (
                        <Image 
                            src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${user.avatar}`}
                            width={60}
                            height={60}
                        />
                    )}
                </div>
                <span className={styles['selected-name']}>
                    {user.display_name || user.username}
                </span>
            </div>
            <button onClick={cancel}>
                {t('cancel')}
            </button>
        </div>
    )
}