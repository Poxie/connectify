import { FilterType } from './Filters';
import styles from './Filters.module.scss';

export const FilterItem: React.FC<FilterType & {
    onClick: (id: string) => void;
    active: boolean;
}> = ({ text, id, onClick, active }) => {
    const className = [
        styles['item'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <li>
            <button 
                className={className}
                onClick={() => onClick(id)}
            >
                {text}
            </button>
        </li>
    )
}