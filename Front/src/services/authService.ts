import axios from 'axios';

const API_URL = 'http://localhost:5170/api';

// Configure axios
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Test function to check server connection
export const testConnection = async (): Promise<string> => {
    try {
        const response = await axios.get(`${API_URL}/users/test`);
        return response.data;
    } catch (error) {
        console.error('Server test failed:', error);
        throw error;
    }
};

export interface LoginCredentials {
    loginId: string;
    password: string;
}

export interface LoginResponse {
    userId: number;
    username: string;
    email: string;
    userType: string;
    token?: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        console.log('Attempting login with:', { ...credentials, password: '***' });
        
        const response = await axiosInstance.post('/users/login', credentials);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Login error:', error);
        
        if (error.response) {
            console.error('Server response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(error.response.data || 'Login failed');
        }
        
        if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response from server. Please make sure the server is running.');
        }
        
        console.error('Error setting up request:', error.message);
        throw new Error('Network error occurred. Please try again.');
    }
};

export const logout = async (): Promise<void> => {
    try {
        console.log('Logging out...');
        
        // Clear user data from localStorage
        localStorage.removeItem('user');
        
        // Optional: Call backend logout endpoint if needed
        // await axiosInstance.post('/users/logout');
        
        console.log('Logout successful');
    } catch (error: any) {
        console.error('Logout error:', error);
        // Clear localStorage anyway, even if API call fails
        localStorage.removeItem('user');
    }
};

export default login;