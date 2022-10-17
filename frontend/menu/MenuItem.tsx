import styles from '../styles/Menu.module.scss';
import { MenuItem as MenuItemType } from "../contexts/menu/types"
import { useMenu } from '../contexts/menu/MenuProvider';
import Link from 'next/link';

export const MenuItem: React.FC<MenuItemType> = ({ text, href, onClick, closeOnClick=true, type='default' }) => {
    const { close } = useMenu();

    // Handling click
    const handleClick = () => {
        onClick && onClick();
        closeOnClick && close();
    }

    // Creating item inner content
    const innerContent = (
        <span>
            {text}
        </span>
    )

    // Creating className
    const className = [
        styles['item'],
        styles[type]
    ].join(' ');

    // Creating properties
    const props = {
        className,
        onClick: handleClick,
    }
    return(
        href ? (
            <Link href={href}>
                <a {...props}>
                    {innerContent}
                </a>
            </Link>
        ) : (
            <button {...props}>
                {innerContent}
            </button>
        )
    )
}