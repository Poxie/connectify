import { useTranslation } from 'next-i18next';
import React, { useMemo, useRef } from 'react';
import { AttachmentIcon } from '../../assets/icons/AttachmentIcon';
import { Post, TempAttachment } from '../../types';
import { Dropdown, DropdownItem } from '../dropdown';
import { HasTooltip } from '../tooltip/HasTooltip';
import styles from './PostOptions.module.scss';

export const PostOptions: React.FC<{
    onAttachmentAdd: (attachments: TempAttachment[]) => void;
    onVisibilityChange: (visibility: Post['privacy']) => void;
    visibility: Post['privacy'];
}> = ({ onAttachmentAdd, visibility, onVisibilityChange }) => {
    const { t } = useTranslation('common');
    const inputRef = useRef<HTMLInputElement>(null);

    const openAttachmentPrompt = () => {
        inputRef.current?.click();
    }
    const onAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        
        const processedAttachments: TempAttachment[] = []
        for(const file of Array.from(files)) {
            const blob = new Blob([file]);
            const preview = URL.createObjectURL(blob);
            processedAttachments.push({
                file,
                preview,
                id: Math.random()
            })
        }

        onAttachmentAdd(processedAttachments);
    }

    const dropdownItems: DropdownItem[] = useMemo(() => [
        { text: t('visibility.all'), id: 'all' },
        { text: t('visibility.semi'), id: 'semi' },
        { text: t('visibility.private'), id: 'private'}
    ], [])
    
    return(
        <div className={styles['container']}>
            <HasTooltip tooltip={t('addAttachment')}>
                <button
                    aria-label={t('addAttachment')}
                    onClick={openAttachmentPrompt}
                    className={styles['button']}
                >
                    <AttachmentIcon />
                    <input 
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        multiple
                        onChange={onAttachmentChange}
                        ref={inputRef}
                    />
                </button>
            </HasTooltip>
            <Dropdown 
                items={dropdownItems}
                defaultActive={visibility}
                position={'top'}
                onChange={value => onVisibilityChange(value as Post['privacy'])}
            />
        </div>
    )
}