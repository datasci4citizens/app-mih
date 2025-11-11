import axios from 'axios';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL,
	withCredentials: true,
	headers: {
		'ngrok-skip-browser-warning': 'true',
	},
});

export default apiClient;