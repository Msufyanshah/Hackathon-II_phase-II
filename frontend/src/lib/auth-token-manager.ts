import { apiClientInstance } from './ApiClient';

export const updateToken = (token: string | null) => {
  if (token) {
    apiClientInstance.setToken(token);
  } else {
    // This will now work because apiClientInstance is the class
    apiClientInstance.clearToken();
  }
};