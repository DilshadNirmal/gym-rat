
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 5000,
		allowedHosts: [
			'.replit.dev',
			'.repl.co'
		]
	}
});
