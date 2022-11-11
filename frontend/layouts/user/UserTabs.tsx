import styles from '../../styles/User.module.scss';
import Link from "next/link"
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useQueryId } from '../../hooks/useQueryId';
import { useState } from 'react';

const tabs = [
    { text: 'posts', path: '' },
    { text: 'likedPosts', path: '/liked-posts' }
]
export const UserTabs = () => {
    const { t } = useTranslation('user');
    const asPath = useRouter().asPath;
    const userId = useQueryId('userId');

    return(
        <motion.ul 
            initial={{ opacity: 0, translateY: 0 }}
            exit={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            className={styles['tabs']}
        >
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
        </motion.ul>
    )
}