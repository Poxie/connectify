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
    textArea?: boolean;
}> = ({ inputClassName, labelClassName, placeholder, defaultValue, onChange, onSubmit, onFocus, onBlur, label, name, textArea=false }) => {
    const [value, setValue] = useState(defaultValue || '');

    // Updating value on defaultValue change
    useEffect(() => {
        setValue(defaultValue || '');
    }, [defaultValue]);

    // Handling input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setValue(value);

        onChange && onChange(value);
    }

    // Checking if key is enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(e.key !== 'Enter') return;

        onSubmit && onSubmit(value);
    }

    // Creating classNames
    inputClassName = [
        styles['container'],
        inputClassName ? inputClassName : ''
    ].join(' ');
    labelClassName = [
        styles['label'],
        labelClassName ? labelClassName : ''
    ].join(' ');

    // Properties
    const properties = {
        placeholder,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onBlur,
        onFocus,
        value,
        name,
        id: name,
        className: inputClassName
    }
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
        {textArea ? (
            <textarea
                style={{ 
                    minHeight: 90,
                    maxHeight: 300
                }} 
                {...properties}
            />
        ) : (
            <input
                type="text" 
                {...properties}
            />
        )}
        </>
    )
}