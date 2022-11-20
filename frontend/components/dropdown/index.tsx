import { useEffect, useRef, useState } from 'react';
import styles from './Dropdown.module.scss';

export type DropdownItem = {
    text: string;
    id: string;
}
export const Dropdown: React.FC<{
    items: DropdownItem[];
    defaultActive?: string;
    position?: 'top' | 'bottom';
    onChange?: (id: string) => void;
    activeItemClassName?: string;
}> = ({ items, defaultActive, onChange, activeItemClassName, position='bottom' }) => {
    const [active, setActive] = useState(defaultActive || items[0].id);
    const [displayOptions, setDisplayOptions] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Updating active on defaultActive chane
    useEffect(() => {
        if(!defaultActive) return;
        setActive(defaultActive);
    }, [defaultActive]);

    // Closing on click outside component
    useEffect(() => {
        const checkForClickOutside = (e: MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as any)) {
                close();
            }
        }
        document.addEventListener('mousedown', checkForClickOutside);
        return () => document.removeEventListener('mousedown', checkForClickOutside);
    }, []);

    const onClick = (id: string) => {
        setActive(id);
        onChange && onChange(id);
        toggle();
    }

    const close = () => setDisplayOptions(false);
    const toggle = () => setDisplayOptions(prev => !prev);

    const activeItem = items.find(item => item.id === active);

    const className = [
        styles['container'],
        styles[position],
        displayOptions ? styles['open'] : ''
    ].join(' ');
    activeItemClassName = [
        styles['active-item'],
        activeItemClassName
    ].join(' ');
    return(
        <div className={className} ref={ref}>
            <button 
                className={activeItemClassName}
                onClick={toggle}
            >
                {activeItem?.text}
            </button>

            {displayOptions && (
                <ul className={styles['item-container']}>
                    {items.map(item => (
                        <li key={item.id}>
                            <button onClick={() => onClick(item.id)}>
                                {item.text}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}