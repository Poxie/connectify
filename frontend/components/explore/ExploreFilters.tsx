import styles from '../../styles/Explore.module.scss';
import { useEffect, useRef, useState } from "react"
import { Filters, FilterType } from "../filters/Filters"
import { useAppSelector } from '../../redux/store';
import { selectExploreFilter } from '../../redux/explore/selectors';
import { useDispatch } from 'react-redux';
import { setExploreFilter } from '../../redux/explore/actions';
import { ExploreFilter } from '../../redux/explore/types';
import { useTranslation } from 'next-i18next';

export const ExploreFilters = () => {
    const { t } = useTranslation('home');
    const dispatch = useDispatch();
    const active = useAppSelector(selectExploreFilter);

    const [isSticky, setIsSticky] = useState(false);
    const ref = useRef<HTMLUListElement>(null)

    useEffect(() => {
        let prevTop = 0;
        const onScroll = () => {
            if(!ref.current) return;

            const { top } = ref.current.getBoundingClientRect();
            if(top === prevTop) return;
            prevTop = top;
            
            const SCROLL_THRESHOLD = parseInt(
                window.getComputedStyle(document.documentElement)
                    .getPropertyValue('--navbar-height')
                    .replace('px','')
            );

            setIsSticky(top <= SCROLL_THRESHOLD);
        }

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const changeFilter = (id: string) => {
        dispatch(setExploreFilter(id as ExploreFilter));
    }
    
    const filters: FilterType[] = [
        { id: 'top', text: t('explore.top') },
        { id: 'latest', text: t('explore.latest') }
    ]

    const className = [
        styles['filters'],
        isSticky ? styles['sticky'] : ''
    ].join(' ');
    return(
        <>
            <Filters 
                items={filters}
                onChange={changeFilter}
                defaultActive={active}
                containerClassName={className}
                ref={ref}
            />
        </>
    )
}