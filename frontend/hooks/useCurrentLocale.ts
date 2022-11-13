export const useCurrentLocale = () => {
    const locale = typeof window !== 'undefined' ? (
        localStorage.getItem('locale') || process.env.NEXT_PUBLIC_DEFAULT_LOCALE
    ) : process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
    return locale;
}