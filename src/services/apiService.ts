import { API_BASE_URL, getCsrfToken, initializeCsrfToken } from '../api';
import { DonationItem, ChatSession, ChatMessage, UserRole } from '../types';

// Role mappings
export const backendRoleFromFrontend: Record<UserRole, string> = {
  donor: 'donateur',
  beneficiary: 'beneficiaire',
  association: 'association',
  volunteer: 'benevole',
  center: 'association', // Default fallback
};

export const frontendRoleFromBackend = (role: string): UserRole => {
  switch (role) {
    case 'donateur':
      return 'donor';
    case 'beneficiaire':
      return 'beneficiary';
    case 'benevole':
      return 'volunteer';
    case 'association':
    default:
      return 'association';
  }
};

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('rahmabox_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.getAuthToken();
    const headers = new Headers(options.headers || {});
    
    headers.set('Accept', 'application/json');
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Include CSRF token
    const csrf = getCsrfToken();
    if (csrf) {
      headers.set('X-CSRF-TOKEN', csrf);
    }

    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const payload = await response.json();

    if (!response.ok) {
      const errorMsg = payload.message || 
        (payload.errors ? Object.values(payload.errors).flat()[0] : undefined) || 
        'Une erreur est survenue.';
      throw new Error(errorMsg as string);
    }

    return payload;
  }

  // --- Auth Endpoints ---

  async login(email: string, password: string) {
    await initializeCsrfToken();
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  }

  async register(formData: any) {
    await initializeCsrfToken();
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return data;
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout request failed on backend:', e);
    }
  }

  async me() {
    const response = await this.request('/api/auth/me');
    return response.data;
  }

  // --- Items / Donations Endpoints ---

  async getItems(params?: { latitude?: number; longitude?: number; radius?: number }): Promise<DonationItem[]> {
    let url = '/api/items';
    if (params && params.latitude !== undefined && params.longitude !== undefined) {
      url += `?latitude=${params.latitude}&longitude=${params.longitude}`;
      if (params.radius !== undefined) {
        url += `&radius=${params.radius}`;
      }
    }
    const response = await this.request(url);
    return response.data;
  }

  async createItem(item: Omit<DonationItem, 'id' | 'timePosted' | 'status' | 'donorName' | 'coordinates'> & { imageFile?: File | null }): Promise<DonationItem> {
    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('category', item.category);
    formData.append('condition', item.condition);
    formData.append('location', item.location);
    formData.append('description', item.description || '');
    
    if (item.latitude !== undefined) {
      formData.append('latitude', String(item.latitude));
    }
    if (item.longitude !== undefined) {
      formData.append('longitude', String(item.longitude));
    }

    if (item.imageFile) {
      formData.append('image', item.imageFile);
    } else if (item.imageUrl) {
      formData.append('image_url', item.imageUrl);
    }
    
    const response = await this.request('/api/items', {
      method: 'POST',
      body: formData,
    });
    
    return response.data;
  }

  async updateItemStatus(itemId: string, status: string): Promise<DonationItem> {
    const response = await this.request(`/api/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  // --- Chat & Messages Endpoints ---

  async getChats(): Promise<ChatSession[]> {
    const response = await this.request('/api/chats');
    return response.data;
  }

  async startChat(donationItemId: string): Promise<ChatSession> {
    const response = await this.request('/api/chats', {
      method: 'POST',
      body: JSON.stringify({ donation_item_id: donationItemId }),
    });
    return response.data;
  }

  async getMessages(chatSessionId: string): Promise<ChatMessage[]> {
    const response = await this.request(`/api/chats/${chatSessionId}/messages`);
    return response.data;
  }

  async sendMessage(chatSessionId: string, content: string): Promise<ChatMessage> {
    const response = await this.request(`/api/chats/${chatSessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response.data;
  }
}

export const apiService = new ApiService();
