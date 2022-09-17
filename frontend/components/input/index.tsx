import React, { useEffect, useState } from "react";
import styles from './Input.module.scss';

export const Input: React.FC<{
    inputClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    onChange?: (text: string) => void;
    onSubmit?: (text: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    defaultValue?: string;
    label?: string;
    name?: string;
}> = ({ inputClassName, labelClassName, placeholder, defaultValue, onChange, onSubmit, onFocus, onBlur, label, name }) => {
    const [value, setValue] = useState(defaultValue || '');

    // Updating value on defaultValue change
    useEffect(() => {
        setValue(defaultValue || '');
    }, [defaultValue]);

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

    inputClassName = [
        styles['container'],
        inputClassName ? inputClassName : ''
    ].join(' ');
    labelClassName = [
        styles['label'],
        labelClassName ? labelClassName : ''
    ].join(' ');
    return(
        <>
        {label && (
            <label 
                htmlFor={name} 
                className={labelClassName}
            >
                {label}
            </label>
        )}
        <input 
            type="text"
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            onFocus={onFocus}
            value={value}
            name={name}
            id={name}
            className={inputClassName}
        />
        </>
    )
}