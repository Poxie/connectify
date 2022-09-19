declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            NEXT_PUBLIC_API_ENDPOINT: string;
            NEXT_PUBLIC_WEBSITE_NAME: string;
            NEXT_PUBLIC_BANNER_ENDPOINT: string;
        }
    }
}

export {};