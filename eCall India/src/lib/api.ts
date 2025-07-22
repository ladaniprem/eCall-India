const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API response interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

// Error response interface
interface ApiError {
  success: false;
  message: string;
  timestamp: string;
  error?: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  // Load token from localStorage
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Save token to localStorage
  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      this.token = token;
    }
  }

  // Remove token from localStorage
  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      this.token = null;
    }
  }

  // Get headers for requests
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Make API request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> | ApiError = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return (data as ApiResponse<T>).data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user: any }> {
    const result = await this.request<{ token: string; user: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      false
    );

    this.saveToken(result.token);
    return result;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: any }> {
    const result = await this.request<{ token: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false
    );

    this.saveToken(result.token);
    return result;
  }

  async googleAuth(googleData: {
    googleId: string;
    email: string;
    name: string;
  }): Promise<{ token: string; user: any }> {
    const result = await this.request<{ token: string; user: any }>(
      '/auth/google',
      {
        method: 'POST',
        body: JSON.stringify(googleData),
      },
      false
    );

    this.saveToken(result.token);
    return result;
  }

  async getProfile(): Promise<{ user: any }> {
    return this.request<{ user: any }>('/auth/me');
  }

  async updateProfile(profileData: any): Promise<{ user: any }> {
    return this.request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getProfileCompletion(): Promise<{
    profileComplete: boolean;
    completionPercentage: number;
    missingFields: string[];
    nextStep: string | null;
  }> {
    return this.request('/auth/profile-completion');
  }

  // Emergency methods
  async triggerEmergency(emergencyData: {
    emergencyType: 'crash' | 'medical' | 'manual' | 'voice_triggered';
    severity: 'low' | 'medium' | 'high';
    location: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      address?: string;
    };
    crashData?: any;
    deviceInfo?: any;
    notes?: string;
  }): Promise<{ emergencyLog: any; message: string }> {
    return this.request('/emergency/trigger', {
      method: 'POST',
      body: JSON.stringify(emergencyData),
    });
  }

  async uploadEmergencyVideo(
    emergencyId: string,
    videoFile: File,
    recordingType: 'pre_crash' | 'post_crash' | 'manual' = 'manual'
  ): Promise<{ video: any; emergencyLog: any }> {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('recordingType', recordingType);

    const response = await fetch(
      `${this.baseURL}/emergency/${emergencyId}/upload-video`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Video upload failed');
    }

    return data.data;
  }

  async getEmergencyLogs(params: {
    page?: number;
    limit?: number;
    status?: string;
    emergencyType?: string;
    severity?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<{
    emergencyLogs: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalLogs: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/emergency/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getEmergencyLog(id: string): Promise<{ emergencyLog: any }> {
    return this.request(`/emergency/logs/${id}`);
  }

  async resolveEmergency(
    id: string,
    resolveData: {
      resolvedBy: 'user' | 'emergency_services' | 'family' | 'auto_timeout';
      notes?: string;
    }
  ): Promise<{ emergencyLog: any }> {
    return this.request(`/emergency/logs/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify(resolveData),
    });
  }

  async getEmergencyStats(days: number = 30): Promise<{
    stats: {
      totalEmergencies: number;
      crashCount: number;
      highSeverityCount: number;
      avgResponseTime: number;
      falseAlarmCount: number;
    };
    period: string;
  }> {
    return this.request(`/emergency/stats?days=${days}`);
  }

  // Health check methods
  async healthCheck(): Promise<any> {
    return this.request('/health', {}, false);
  }

  async databaseHealth(): Promise<any> {
    return this.request('/health/database', {}, false);
  }

  async servicesHealth(): Promise<any> {
    return this.request('/health/services', {}, false);
  }

  // Utility methods
  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
export type { ApiResponse, ApiError };