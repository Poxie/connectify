export type Theme = 'light' | 'light-contrast' | 'dark';
export type Context = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}