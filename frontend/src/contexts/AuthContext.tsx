import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../lib/types';
import { saveToken, getToken, removeToken, isAuthenticated as isAuthenticatedUtil, decodeToken, isTokenExpired } from '../lib/auth';
import apiClient from '../lib/ApiClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthAction {
  type: string;
  payload?: any;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: getToken(),
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (token && !isTokenExpired(token)) {
        try {
          // Set the token in the API client
          apiClient.setToken(token);

          // Fetch user details
          await fetchCurrentUser();
        } catch (error) {
          console.error('Error initializing auth:', error);
          removeToken();
          apiClient.clearToken();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // Token is expired or doesn't exist
        removeToken();
        apiClient.clearToken();
        dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiClient.login({ email, password });
      const { access_token, user } = response.data.data;

      // Save token and set in API client
      saveToken(access_token);
      apiClient.setToken(access_token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: access_token, user }
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await apiClient.register({ email, password, username });
      const { access_token, user } = response.data.data;

      // Save token and set in API client
      saveToken(access_token);
      apiClient.setToken(access_token);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { token: access_token, user }
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      const user = response.data.data;

      dispatch({
        type: 'FETCH_USER_SUCCESS',
        payload: { user }
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
    }
  };

  const logout = () => {
    removeToken();
    apiClient.clearToken();
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    state,
    login,
    register,
    logout,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};