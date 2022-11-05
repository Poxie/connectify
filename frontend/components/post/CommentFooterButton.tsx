import { ReactElement } from 'react';
import styles from '../../styles/Post.module.scss';

export const CommentFooterButton: React.FC<{
    icon: ReactElement;
    text: string;
    onClick: () => void;
    active: boolean;
}> = ({ icon, text, onClick, active }) => {
    const className = [
        styles['comment-footer-button'],
        active ? styles['active'] : ''
    ].join(' ');
    return(
        <div 
            className={className}
            onClick={onClick}
        >
            {icon}

            <span>
                {text}
            </span>
        </div>
    )
}