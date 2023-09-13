import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(() => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        build: {
            outDir: 'dist' // Diretório de saída para os arquivos de produção
        },
        server: {
            // eslint-disable-next-line no-undef
            port: process.env.PORT, // Porta do servidor de desenvolvimento
            host: '0.0.0.0'
        }
    };
});
