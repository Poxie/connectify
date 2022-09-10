import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import styles from './HomeLayout.module.scss';

const tabs = [
    { text: 'Your feed', path: '/home' },
    { text: 'Explore', path: '/home/explore' }
]
const tabPaths = tabs.map(tab => tab.path);
export const HomeLayoutTabs = () => {
    const router = useRouter();
    const path = router.pathname;
    const tabIndex = tabPaths.indexOf(path);
    const stripe = useRef<HTMLDivElement>(null);

    // Changing tab
    const changeTab = (path: string) => {
        router.push(path, undefined);
    }

    // Updating stripe
    useEffect(() => {
        if(!stripe.current) return;

        stripe.current.style.left = `${tabIndex * 50}%`;
    }, [tabIndex]);

    return(
        <ul className={styles['tabs']}>
            {tabs.map(({ text, path }, index) => {
                const active = index === tabIndex;

                const className = [
                    styles['tab'],
                    active ? styles['active-tab'] : ''
                ].join(' ');
                return(
                    <li 
                        className={className} 
                        key={path}
                    >
                        <button onClick={() => changeTab(path)}>
                            {text}
                        </button>
                    </li>
                )
            })}

            <div 
                className={styles['tab-stripe']}
                aria-hidden="true"
                ref={stripe}
            />
        </ul>
    )
}