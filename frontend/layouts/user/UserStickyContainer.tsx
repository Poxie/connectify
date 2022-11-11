import styles from '../../styles/User.module.scss';
import { useEffect, useRef, useState } from "react"
import { UserTabs } from "./UserTabs"
import { UserMinifiedProfile } from './UserMinifiedProfile';
import { AnimatePresence } from 'framer-motion';

export const UserStickyContainer = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        let prevTop = 0;
        const onScroll = () => {
            if(!ref.current) return;
            
            // Getting container position relative to top of screen
            const top = ref.current.getBoundingClientRect().top;
            
            // Preventing unnecessary computing if sticky position is same
            if(top === prevTop) return;
            prevTop = top;
            console.log('oops');

            // Getting navbar height, i.e., stick scroll position
            const SCROLL_THRESHOLD = parseInt(
                window.getComputedStyle(document.documentElement)
                    .getPropertyValue('--navbar-height')
                    .replace('px','')
            );

            // If scroll threshold is met, show profile
            if(ref.current.getBoundingClientRect().top <= SCROLL_THRESHOLD) {
                setShowProfile(true);
            } else {
                setShowProfile(false);
            }
        }

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return(
        <div 
            className={styles['sticky-container']}
            ref={ref
        }>
            <AnimatePresence>
                {!showProfile && (
                    <UserTabs />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showProfile && (
                    <UserMinifiedProfile />
                )}
            </AnimatePresence>
        </div>
    )
}