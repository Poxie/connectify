import React, { ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { ALLOWED_COLORS, ALLOWED_THEMES, COLORS, DEFAULT_COLOR, DEFAULT_THEME } from './constants';
import { Color, Context, Theme } from './types';

const ThemeContext = React.createContext({} as Context);

export const useTheme = () => React.useContext(ThemeContext);

// Getting active theme
const getActiveTheme = () => {
    const theme = localStorage.getItem('theme') || '';
    
    // Checking if theme is valid
    if(ALLOWED_THEMES.includes(theme)) {
        return theme as Theme;
    }
    return DEFAULT_THEME;
}

// Getting active color
const getActiveColor = () => {
    const color = localStorage.getItem('color') || '';

    // Checking if color is valid
    if(ALLOWED_COLORS.includes(color)) {
        return color as Color;
    }
    return DEFAULT_COLOR;
}

export const ThemeProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const [color, setColor] = useState<Color>(DEFAULT_COLOR);

    // Function to store and update theme
    const updateTheme = (theme: Theme) => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    }
    
    // Function to store and update color
    const updateColor = (color: Color) => {
        setColor(color);
        localStorage.setItem('color', color);
    }

    // Setting theme on client mount
    useLayoutEffect(() => {
        setTheme(getActiveTheme());
        setColor(getActiveColor());
    }, []);

    // Updating theme colors
    useLayoutEffect(() => {
        document.body.setAttribute('theme', theme);
    }, [theme]);

    // Updating colors
    useLayoutEffect(() => {
        // Getting correct colors
        const colors = COLORS[color];

        // Updating color variables
        Object.entries(colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--color-${key}`, value);
        });
    }, [color]);

    const value = {
        theme,
        setTheme: updateTheme,
        color,
        setColor: updateColor
    }
    return(
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}