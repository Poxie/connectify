import React, { useState } from "react";
import styles from './Input.module.scss';

export const Input: React.FC<{
    placeholder?: string;
    onChange?: (text: string) => void;
    onSubmit?: (text: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    defaultValue?: string;
}> = ({ placeholder, defaultValue, onChange, onSubmit, onFocus, onBlur }) => {
    const [value, setValue] = useState(defaultValue || '');

    // Handling input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);

        onChange && onChange(value);
    }

    // Checking if key is enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return;

        onSubmit && onSubmit(value);
    }

    return(
        <input 
            type="text"
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            onFocus={onFocus}
            value={value}
            className={styles['container']}
        />
    )
}