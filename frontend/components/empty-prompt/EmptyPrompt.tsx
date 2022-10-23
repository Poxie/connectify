import { motion } from 'framer-motion';
import styles from './EmptyPrompt.module.scss';
import { ReactElement } from 'react';
import Button from '../button';

export const EmptyPrompt: React.FC<{
    header: string;
    message: string;
    buttons: {text: string, type: 'default' | 'secondary', path?: string}[];
}> = ({ header, message, buttons }) => {
    return(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .35 }}
            className={styles['container']}
        >
            <h2>
                {header}
            </h2>
            <span>
                {message}
            </span>
            <div className={styles['buttons']}>
                {buttons.map(button => (
                    <Button
                        href={button.path}
                        type={button.type}
                    >
                        {button.text}
                    </Button>
                ))}
            </div>
        </motion.div>
    )
}