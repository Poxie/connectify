import styles from '../../styles/User.module.scss';
import Link from "next/link"
import { useRouter } from 'next/router';

const tabs = [
    { text: 'Posts', path: '' },
    { text: 'Liked posts', path: '/liked-posts' }
]
export const UserTabs: React.FC<{
    userId: string;
}> = ({ userId }) => {
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
                                    {tab.text}
                                </span>
                            </a>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}