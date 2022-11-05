import { ReactElement, useEffect, useRef } from "react";
import { useTooltip } from "../../contexts/tooltip/TooltipProvider";
import { TooltipPosition } from "../../contexts/tooltip/types";

export const HasTooltip: React.FC<{
    tooltip: string | ReactElement;
    children: ReactElement;
    className?: string;
    position?: TooltipPosition;
    onClick?: () => void;
    delay?: number;
}> = ({ children, className, onClick, tooltip, position='top', delay=0 }) => {
    const { setTooltip, close } = useTooltip();
    const ref = useRef<HTMLDivElement>(null);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const onMouseEnter = () => {
        timeout.current = setTimeout(() => {
            setTooltip({ tooltip, position }, ref);
        }, delay);
    }
    const onMouseLeave = () => {
        if(timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
        close();
    }

    // Closing and cancelling on unmount
    useEffect(() => {
        return () => {
            if(timeout.current) {
                clearTimeout(timeout.current);
            }
            close();
        }
    }, []);

    return(
        <div 
            className={className} 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            ref={ref}
        >
            {children}
        </div>
    )
}