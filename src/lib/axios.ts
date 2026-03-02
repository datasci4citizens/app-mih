import axios from 'axios';

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
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Faz refresh automático do JWT em caso de 401
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refresh = localStorage.getItem('refresh_token');

			if (refresh) {
				try {
					const refreshResponse = await axios.post(
						`${import.meta.env.VITE_SERVER_URL}/api/token/refresh/`,
						{ refresh },
						{ headers: { 'ngrok-skip-browser-warning': 'true' } },
					);
					const newAccessToken = refreshResponse.data.access;
					localStorage.setItem('access_token', newAccessToken);
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return apiClient(originalRequest);
				} catch {
					// Refresh inválido — limpa tokens e força relogin
					localStorage.removeItem('access_token');
					localStorage.removeItem('refresh_token');
				}
			}
		}

		return Promise.reject(error);
	},
);

export default apiClient;