// Color related constants
export const COLORS = {
    blue: {
        primary: '#008FA2',
        secondary: '#006F7E'
    },
    orange: {
        primary: '#ff7700',
        secondary: '#de6902'
    },
    purple: {
        primary: '#bb00ff',
        secondary: '#9d00d6'
    },
    red: {
        primary: '#f20025',
        secondary: '#e00022'
    },
    pink: {
        primary: '#ff00bf',
        secondary: '#d900a2'
    }
}
export const DEFAULT_COLOR = 'blue';
export const ALLOWED_COLORS = Object.keys(COLORS);

// Theme related constants
export const DEFAULT_THEME = 'light';
export const ALLOWED_THEMES = ['light', 'light-contrast', 'dark'];