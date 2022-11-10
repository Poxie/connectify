import { AnimatePresence } from "framer-motion";
import React, { ReactElement, useRef, useState } from "react";
import { Toast } from "./Toast";
import { Context, ToastType } from "./types";

const ToastContext = React.createContext({} as Context)

export const useToast = () => React.useContext(ToastContext);

const DEFAULT_TYPE = 'info';
const DEFAULT_DURATION = 5000;
export const ToastProvider: React.FC<{
    children: ReactElement;
}> = ({ children }) => {
    const toastQueue = useRef<{
        toast: string;
        type: ToastType;
        duration: number;
    }[]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [type, setType] = useState<ToastType>(DEFAULT_TYPE);
    const [duration, setDuration] = useState(DEFAULT_DURATION);

    const _setToast: Context['setToast'] = (newToast, type=DEFAULT_TYPE, duration=DEFAULT_DURATION) => {
        if(toast && toast !== newToast) {
            toastQueue.current.push({ toast: newToast, type, duration });
            return;
        } else if(toast === newToast) {
            return;
        }

        setToast(newToast);
        setType(type);
        setDuration(duration);

        // Closing toast after duration
        setTimeout(close, duration)
    }
    const close = () => {
        setToast(null);

        if(toastQueue.current.length) {
            const { toast, type, duration } = toastQueue.current[0];
            _setToast(toast, type, duration);
            toastQueue.current.shift();
        }
    }
    
    const value = {
        setToast: _setToast,
        close
    }
    return(
        <ToastContext.Provider value={value}>
            {children}

            <AnimatePresence>
                {toast && (
                    <Toast 
                        text={toast}
                        type={type}
                        duration={duration}
                        key={toast}
                    />
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    )
}