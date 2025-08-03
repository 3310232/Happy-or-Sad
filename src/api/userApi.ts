// src/api/userApi.js
import api from './apiServer';

export const login = (userName:string, password:string) => {
  return api.post('/users/login', { userName, password });
};
