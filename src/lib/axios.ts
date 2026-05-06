import axios from 'axios';
import { mutate } from 'swr';
import { notifyApiError } from './api-error';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL,
	withCredentials: true,
	headers: {
		'ngrok-skip-browser-warning': 'true',
	},
});

// Injeta o JWT em toda requisição
apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('access_token');
	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`;
		if (import.meta.env.VITE_DEV_MODE === 'true') {
			console.log(`[Axios] Enviando token para ${config.url}`);
		}
	}
	return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(token);
	});
	failedQueue = [];
};

// Faz refresh automático do JWT em caso de 401
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((token) => {
					originalRequest._retry = true;
					originalRequest.headers['Authorization'] = `Bearer ${token}`;
					return apiClient(originalRequest);
				}).catch((err) => Promise.reject(err));
			}

			const refresh = localStorage.getItem('refresh_token');

			if (!refresh) {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				mutate(() => true, undefined, { revalidate: false });
				return Promise.reject(error);
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshResponse = await axios.post(
					`${import.meta.env.VITE_SERVER_URL}/api/token/refresh/`,
					{ refresh },
					{ headers: { 'ngrok-skip-browser-warning': 'true' } },
				);
				const newAccessToken = refreshResponse.data.access;

				if (!newAccessToken) throw new Error("No token returned");

				localStorage.setItem('access_token', newAccessToken);

				if (refreshResponse.data.refresh) {
					localStorage.setItem('refresh_token', refreshResponse.data.refresh);
				}

				processQueue(null, newAccessToken);
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				mutate(() => true, undefined, { revalidate: false });
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		if (error.response?.status >= 500) {
			notifyApiError(error, 'Erro interno no servidor.');
		}

		return Promise.reject(error);
	},
);

export default apiClient;