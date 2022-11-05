import { useState } from 'react';
import { FilterItem } from './FilterItem';
import styles from './Filters.module.scss';

export type FilterType = {
    id: string;
    text: string;
}
export const Filters: React.FC<{
    items: FilterType[];
    onChange: (id: string) => void;
    defaultActive?: string;
    containerClassName?: string;
}> = ({ items, onChange, defaultActive, containerClassName }) => {
    const [active, setActive] = useState(defaultActive || items[0].id);

    const onClick = (id: string) => {
        setActive(id);
        onChange(id);
    }

    const className = [
        styles['container'],
        containerClassName
    ].join(' ');
    return(
        <ul className={className}>
            {items.map(item => (
                <FilterItem 
                    {...item}
                    active={item.id === active}
                    onClick={onClick}
                    key={item.id}
                />
            ))}
        </ul>
    )
}