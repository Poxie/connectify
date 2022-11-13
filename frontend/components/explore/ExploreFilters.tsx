import styles from '../../styles/Explore.module.scss';
import { useState } from "react"
import { Filters, FilterType } from "../filters/Filters"
import { useAppSelector } from '../../redux/store';
import { selectExploreFilter } from '../../redux/explore/selectors';
import { useDispatch } from 'react-redux';
import { setExploreFilter } from '../../redux/explore/actions';
import { ExploreFilter } from '../../redux/explore/types';

const FILTERS: FilterType[] = [
    { id: 'top', text: 'Most popular' },
    { id: 'latest', text: 'Most recent' }
]
export const ExploreFilters = () => {
    const dispatch = useDispatch();
    const active = useAppSelector(selectExploreFilter);

    const changeFilter = (id: string) => {
        dispatch(setExploreFilter(id as ExploreFilter));
    }
    
    return(
        <Filters 
            items={FILTERS}
            onChange={changeFilter}
            defaultActive={active}
            containerClassName={styles['filters']}
        />
    )
}