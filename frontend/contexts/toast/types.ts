export type ToastType = 'info' | 'success' | 'error';
export type Context = {
    setToast: (text: string, type?: ToastType, duration?: number) => void;
    close: () => void;
}