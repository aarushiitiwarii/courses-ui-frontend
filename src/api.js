import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

export const getCourses = () => api.get('/courses').then(res => res.data);

export const createCourse = (data) =>
  api.post('/courses', data).then(res => res.data);

export default api;
