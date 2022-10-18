export type Theme = 'light' | 'dark';
export type Context = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}