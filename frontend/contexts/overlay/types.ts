import { ReactElement } from "react";

export type Context = {
    setOverlay: (overlay: ReactElement) => void;
    close: () => void;
}