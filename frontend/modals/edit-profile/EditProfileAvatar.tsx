import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useRef } from 'react';
import { User } from '../../types';
import styles from './EditProfileModal.module.scss';

export const EditProfileAvatar: React.FC<{
    updateProperty: (key: keyof User, value: any) => void;
    avatar: File | string | null;
}> = ({ updateProperty, avatar }) => {
    const { t } = useTranslation('common');
    const input = useRef<HTMLInputElement>(null);

    const openFileSelector = () => {
        console.log(input.current);
        input.current?.click();
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        updateProperty('avatar', file);
    }

    // Determining url based on avatar id or file objet
    let url;
    if(avatar instanceof File) {
        const blob = new Blob([avatar]);
        url = URL.createObjectURL(blob);
    } else if(avatar) {
        url = `${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}${avatar}`;
    }

    const className = [
        styles['avatar'],
        url !== undefined ? styles['has-image'] : ''
    ].join(' ');
    return(
        <div 
            className={className} 
            onClick={openFileSelector}
            data-hover-text={t('changeAvatar')}
        >
            {url && (
                <Image 
                    width={100}
                    height={100}
                    src={url}
                />
            )}
            <input 
                onChange={handleChange}
                type="file"
                ref={input} 
            />
        </div>
    )
}