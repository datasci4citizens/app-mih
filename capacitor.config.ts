import type { CapacitorConfig } from '@capacitor/cli';
import 'dotenv/config';

const config: CapacitorConfig = {
	appId: 'br.unicamp.ic.mih',
	appName: 'mih',
	webDir: 'dist',
	plugins: {
		SocialLogin: {
			google: {
				webClientId: process.env.VITE_GOOGLE_CLIENT_ID
			},
		},
	},
};

export default config;
