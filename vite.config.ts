import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
	return defineConfig({
		define: {
			'process.env': { ...process.env, ...loadEnv(mode, process.cwd()) },
		},
		plugins: [react()],
		resolve: {
			alias: {
				'@': resolve(__dirname, './src/components/OrderBook'),
			},
		},
		build: {
			outDir: 'build',
			base: './',
			sourcemap: true,
			rollupOptions: {
				input: {
					main: resolve(__dirname, 'index.html'),
				},
			},
		},
		server: {
			port: 3000,
		},
	})
}
