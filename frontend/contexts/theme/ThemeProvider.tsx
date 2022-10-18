import React, { ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { Context, Theme } from './types';

const ThemeContext = React.createContext({} as Context);

export const useTheme = () => React.useContext(ThemeContext);

// Getting active theme
const DEFAULT_THEME = 'light';
const ALLOWED_THEMES = ['light', 'dark'];
const getActiveTheme = () => {
    if(typeof window === 'undefined') return DEFAULT_THEME;
    const theme = localStorage.getItem('theme') || '';
    
    // Checking if theme is valid
    if(ALLOWED_THEMES.includes(theme)) {
        return theme as Theme;
    }
    return DEFAULT_THEME;
}

export const ThemeProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(getActiveTheme());

    // Function to store and update theme
    const updateTheme = (theme: Theme) => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    }

    // Updating theme colors
    useLayoutEffect(() => {
        document.body.setAttribute('theme', theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: updateTheme
    }
    return(
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}