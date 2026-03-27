import axios, { AxiosInstance } from 'axios';

class ApiClient {
  public client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    /**
     * REQUEST INTERCEPTOR (Rule 3 & 4)
     * Attaches the Opaque JWT to every outgoing request.
     */
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    /**
     * RESPONSE INTERCEPTOR (Safety Guard with Auto-Refresh)
     * If the Backend returns 401, we try to refresh the token automatically.
     * If refresh fails, we clear the session.
     */
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const newToken = await refreshAccessToken();
            
            if (newToken) {
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }

          // If refresh failed, clear session
          this.clearToken();
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
        }
        return Promise.reject(error);
      }
    );
  }

  public setToken(token: string | null): void {
    console.log("Token Sync:", token ? "JWT Attached" : "JWT Cleared");
    this.token = token;
  }

  public clearToken(): void {
    this.token = null;
  }
}

// Uses environment variable or falls back to local FastAPI address
const apiClientInstance = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
);

// Default export for TaskService usage
export default apiClientInstance.client;

// Named export for the AuthContext manager
export { apiClientInstance };

/**
 * Helper function to refresh access token
 * This is used by the API client interceptor
 */
async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/api/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}