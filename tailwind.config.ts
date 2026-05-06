import type { Config } from 'tailwindcss';
import {
	blue,
	green,
	orange,
	red,
	stone,
	white,
	yellow,
} from 'tailwindcss/colors';

export default {
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				sans: ['Quicksand', 'Nunito', '"Inter Variable"', 'sans-serif'],
				quicksand: ['Quicksand', 'sans-serif'],
				nunito: ['Nunito', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			colors: {
				// New Design Colors
				'mih-primary': '#A0E7E5',
				'mih-secondary': '#FF8A65',
				'mih-highlight': '#F2CF59',
				'mih-peach': '#F8CA9D',
				'mih-sage': '#C5D7C0',
				'mih-text': '#2D3748',
				'mih-text-light': '#718096',
				
				border: stone[200],
				input: stone[200],
				background: white,
				foreground: stone[950],
				card: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: white,
					foreground: stone[950],
				},
				popover: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: white,
					foreground: stone[950],
				},
				primary: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: "#0C4A6E",
					foreground: orange[50],
				},
				secondary: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: stone[100],
					foreground: stone[900],
				},
				muted: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: stone[100],
					foreground: stone[500],
				},
				accent: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: orange[100],
					foreground: orange[900],
				},
				destructive: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: red[500],
					foreground: red[50],
				},
				success: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: green[500],
					foreground: green[50],
				},
				warning: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: yellow[500],
					foreground: yellow[50],
				},
				info: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: blue[500],
					foreground: blue[50],
				},
			},
		},
		plugins: [require('tailwindcss-animate')],
	},
} satisfies Config;
