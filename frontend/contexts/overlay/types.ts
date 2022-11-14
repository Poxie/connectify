import { ReactElement } from "react";

export type Options = {
    onClose?: () => void;
}
export type Context = {
    setOverlay: (overlay: ReactElement, options?: Options) => void;
    close: () => void;
}