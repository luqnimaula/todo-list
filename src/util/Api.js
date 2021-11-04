import axios from 'axios';

axios.create({
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axios.interceptors.request.use((config) => {
    return config;
});

axios.interceptors.response.use((response) => {
	return response;
}, (error) => {
	return Promise.reject(error);
});

export default axios;