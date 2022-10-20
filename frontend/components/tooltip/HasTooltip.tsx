import { ReactElement, useRef } from "react";
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

    const onMouseEnter = () => {
        setTooltip({ tooltip, position }, ref);
    }
    const onMouseLeave = () => {
        close();
    }

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