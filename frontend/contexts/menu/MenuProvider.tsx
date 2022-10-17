import React, { ReactElement, RefObject, useState } from 'react';
import { Menu } from '../../menu/Menu';
import { Context, MenuGroup } from './types';

const MenuContext = React.createContext({} as Context);

export const useMenu = () => React.useContext(MenuContext);

export const MenuProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const [groups, setGroups] = useState<MenuGroup[]>([]);
    const [dimensions, setDimensions] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const _setMenu = (menuGroups: MenuGroup[], ref: RefObject<HTMLElement>) => {
        if(!ref.current) return;

        // Setting menu groups
        setGroups(menuGroups);
        
        // Getting ref dimensions
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        setDimensions({ left, top, width, height });
    }

    const close = () => {
        setGroups([]);
    }

    const value = {
        setMenu: _setMenu,
        close
    }
    return(
        <MenuContext.Provider value={value}>
            {children}

            {groups.length !== 0 && (
                <Menu 
                    groups={groups}
                    dimensions={dimensions}
                />
            )}
        </MenuContext.Provider>
    )
}