import React, { useRef } from 'react';
import { User } from '../../types';
import styles from './EditProfileModal.module.scss';

export const EditProfileBanner: React.FC<{
    updateProperty: (key: keyof User, value: any) => void;
    banner: File | string | null;
}> = ({ updateProperty, banner }) => {
    const input = useRef<HTMLInputElement>(null);

    const openFileSelector = () => {
        input.current?.click();
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        updateProperty('banner', file);
    }

    // Determining url based on banner id or file objet
    let url;
    if(banner instanceof File) {
        const blob = new Blob([banner]);
        url = URL.createObjectURL(blob);
    } else {
        url = `${process.env.NEXT_PUBLIC_BANNER_ENDPOINT}${banner}`;
    }
    return(
        <div 
            className={styles['banner']} 
            onClick={openFileSelector}
            style={{ backgroundImage: `url(${url})` }}
        >
            <input 
                onChange={handleChange}
                type="file"
                ref={input} 
            />
        </div>
    )
}