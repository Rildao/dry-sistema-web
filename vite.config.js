import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    if (mode == 'production') {
        return {
            plugins: [vue()],
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url))
                }
            },
            build: {
                // Defina o diretório de saída para construir seu aplicativo no Railway
                outDir: 'dist' // O Railway usa 'dist' por padrão para saída de build
                // Defina seu caminho base, se necessário (por exemplo, se o aplicativo não estiver na raiz do domínio)
            }
        };
    } else {
        return {
            plugins: [vue()],
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url))
                }
            }
        };
    }
});
