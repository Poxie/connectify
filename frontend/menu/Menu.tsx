import styles from '../styles/Menu.module.scss';
import { MenuGroup as MenuGroupType } from "../contexts/menu/types"
import { MenuGroup } from "./MenuGroup";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMenu } from '../contexts/menu/MenuProvider';

const SPACE_FROM_ELEMENT = 10;
export const Menu: React.FC<{
    groups: MenuGroupType[];
    dimensions: { top: number, left: number, width: number, height: number };
}> = ({ groups, dimensions }) => {
    const { close } = useMenu();
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const ref = useRef<HTMLDivElement>(null);

    // Determining new position
    useLayoutEffect(() => {
        if(!ref.current) return;

        // Getting current element size
        const { width, height } = ref.current.getBoundingClientRect();

        // Calculating new position of element
        let top = dimensions.top + dimensions.height + SPACE_FROM_ELEMENT;
        let left = dimensions.left + dimensions.width - width;

        // Updating with new position
        setPosition({ top, left });
    }, [dimensions.top, dimensions.left]);
    
    // Handling click outside menu
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as any)) {
                close();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref.current]);

    return(
        <div 
            className={styles['container']}
            style={{ left: position.left, top: position.top }}
            ref={ref}
        >
            {groups.map((group, key) => (
                <MenuGroup 
                    items={group}
                    key={key}
                />
            ))}
        </div>
    )
}