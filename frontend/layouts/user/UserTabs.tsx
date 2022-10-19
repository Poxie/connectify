import styles from '../../styles/User.module.scss';
import Link from "next/link"
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const tabs = [
    { text: 'posts', path: '' },
    { text: 'likedPosts', path: '/liked-posts' }
]
export const UserTabs: React.FC<{
    userId: string;
}> = ({ userId }) => {
    const { t } = useTranslation('user');
    const asPath = useRouter().asPath;

    return(
        <ul className={styles['tabs']}>
            {tabs.map(tab => {
                const path = `/users/${userId}${tab.path}`;
                const active = path === asPath;

                return(
                    <li 
                        className={active ? styles['active-tab'] : ''}
                        key={tab.path}
                    >
                        <Link href={`/users/${userId}${tab.path}`}>
                            <a>
                                <span>
                                    {t(tab.text)}
                                </span>
                            </a>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}