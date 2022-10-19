import { COLORS } from "./constants";

export type Theme = 'light' | 'light-contrast' | 'dark';
export type Color = keyof typeof COLORS;
export type Context = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    color: Color;
    setColor: (color: Color) => void;
}