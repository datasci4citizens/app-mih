import axios from 'axios';

const minioClient = axios.create({
	baseURL: import.meta.env.VITE_MINIO_DOMAIN,
	withCredentials: true,
	headers: {
		'ngrok-skip-browser-warning': 'true',
	},
});

export default minioClient;
