import { useState } from "react"
import { useTheme } from "../../../contexts/theme/ThemeProvider";

const getActiveTheme = () => {
    if(typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
}
export const AppearanceThemes = () => {
    const { theme, setTheme } = useTheme();

    return(
        <div>
            <div onClick={() => setTheme('light')}>
                light
            </div>
            <div onClick={() => setTheme('dark')}>
                dark
            </div>
        </div>
    )
}