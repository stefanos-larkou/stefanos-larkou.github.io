/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FORECAST_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
