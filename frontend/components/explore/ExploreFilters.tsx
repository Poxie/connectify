import styles from '../../styles/Explore.module.scss';
import { useState } from "react"
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

    const changeFilter = (id: string) => {
        dispatch(setExploreFilter(id as ExploreFilter));
    }
    
    const filters: FilterType[] = [
        { id: 'top', text: t('explore.top') },
        { id: 'latest', text: t('explore.latest') }
    ]
    return(
        <Filters 
            items={filters}
            onChange={changeFilter}
            defaultActive={active}
            containerClassName={styles['filters']}
        />
    )
}