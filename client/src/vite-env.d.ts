/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Railway (or other) API origin, no trailing slash. Empty in dev uses Vite proxy. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
