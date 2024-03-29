import { motion } from 'framer-motion';
import styles from './EmptyPrompt.module.scss';
import Button from '../button';

export const EmptyPrompt: React.FC<{
    header: string;
    message: string;
    buttons: {text: string, type: 'default' | 'secondary', path?: string, onClick?: () => void}[];
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
                {buttons.map((button, key) => (
                    <Button
                        onClick={button.onClick}
                        href={button.path}
                        type={button.type}
                        key={key}
                    >
                        {button.text}
                    </Button>
                ))}
            </div>
        </motion.div>
    )
}