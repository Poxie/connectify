import React, { useEffect, useRef, useState } from "react";
import styles from './Input.module.scss';

export const Input: React.FC<{
    inputClassName?: string;
    containerClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    onChange?: (text: string) => void;
    onSubmit?: (text: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    focusOnMount?: boolean;
    defaultValue?: string;
    label?: string;
    name?: string;
    textArea?: boolean;
}> = ({ inputClassName, containerClassName, labelClassName, placeholder, defaultValue, onChange, onSubmit, onFocus, onBlur, focusOnMount, label, name, textArea=false }) => {
    const [value, setValue] = useState(defaultValue || '');
    const ref = useRef<any>(null);

    // Updating value on defaultValue change
    useEffect(() => {
        setValue(defaultValue || '');
    }, [defaultValue]);

    // Focusing on mount
    useEffect(() => {
        if(!focusOnMount) return;

        ref.current?.focus();
    }, [focusOnMount]);

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
        <div className={containerClassName}>
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
                    ref={ref}
                    {...properties}
                />
            ) : (
                <input
                    type="text"
                    ref={ref}
                    {...properties}
                />
            )}
        </div>
    )
}