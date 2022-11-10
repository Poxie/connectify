import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef } from "react"
import { usePopout } from "../contexts/popouts/PopoutProvider";

export const HasPopout: React.FC<{
    children: ReactElement;
    popout: ReactElement;
    className?: string;
}> = ({ children, popout, className }) => {
    const { pathname } = useRouter();
    const { close, setPopout, hoverPopout } = usePopout();
    const ref = useRef<HTMLDivElement>(null);
    const hoveringPopout = useRef(hoverPopout);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    // Closing on change of path
    useEffect(close, [pathname]);

    // Updating current popout hover
    useEffect(() => {
        hoveringPopout.current = hoverPopout;
    }, [hoverPopout]);

    // Checking after 400ms if should open popout
    const onMouseEnter = () => {
        timeout.current = setTimeout(() => setPopout(popout, ref), 400);
    }
    // Closing popout
    const onMouseLeave = () => {
        if(timeout.current) clearTimeout(timeout.current);

        // Checking after 400ms if should close popout
        setTimeout(() => {
            if(hoveringPopout.current) return;
            close();
        }, 400);
    }

    return(
        <div 
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={ref}
        >
            {children}
        </div>
    )
}