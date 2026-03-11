import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Keep all svelte internals in one chunk to avoid circular dep warnings
					if (id.includes('node_modules/svelte/')) {
						return 'svelte-internals';
					}
				}
			}
		}
	}
});
