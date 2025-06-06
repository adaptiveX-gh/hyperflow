/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PRIVATE_STRIPE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
