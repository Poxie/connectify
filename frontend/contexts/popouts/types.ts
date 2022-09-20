import { ReactElement, RefObject } from "react";

export type PopoutContext = {
    setPopout: (popout: ReactElement, ref: RefObject<HTMLElement>) => void;
    hoverPopout: boolean;
    close: () => void;
}