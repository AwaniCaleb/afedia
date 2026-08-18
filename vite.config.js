import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Reconciles the Tailwind setup: package.json already lists @tailwindcss/vite
// and tailwindcss as dependencies, but index.html was loading Tailwind via the
// CDN browser script instead of going through this plugin. This wires up the
// plugin so the existing `@import "tailwindcss";` in src/style.css is compiled
// properly by Vite, and the CDN script tag has been removed from index.html.
//
// oloigbe.html (the private page) is registered as a second build entry so it
// still gets emitted into dist/ and is reachable once deployed — even though,
// per the brief, it intentionally stays self-contained and keeps using its own
// Tailwind CDN script tag rather than importing src/style.css.
export default defineConfig({
	plugins: [tailwindcss()],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				oloigbe: resolve(__dirname, 'oloigbe.html'),
			},
		},
	},
});
