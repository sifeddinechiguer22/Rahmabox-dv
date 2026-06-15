import { UserRole } from './types';

const env = import.meta.env as {
  VITE_API_BASE_URL?: string;
  VITE_API_URL?: string;
};

const _rawApi = env.VITE_API_BASE_URL || env.VITE_API_URL || '';
const _normalizedApi = _rawApi.replace(/\/api\/?$/i, '').replace(/\/$/, '');
// In dev, if no API URL is configured, assume backend is at localhost:8000
// Vite proxy will forward /api and /sanctum requests to the backend
export const API_BASE_URL = _normalizedApi || (typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8000');

// Store CSRF token for requests
let csrfToken: string | null = null;

// Extract CSRF token from cookies
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return null;
}

// Initialize CSRF token for Sanctum
export async function initializeCsrfToken(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });
    // After fetching the cookie, extract the token
    csrfToken = getCsrfTokenFromCookie();
  } catch (error) {
    console.warn('Failed to initialize CSRF token:', error);
  }
}

// Get the CSRF token to include in request headers
export function getCsrfToken(): string {
  return csrfToken || getCsrfTokenFromCookie() || '';
}

export const backendRoleFromFrontend: Record<UserRole, string> = {
  donor: 'donateur',
  beneficiary: 'beneficiaire',
  association: 'association',
  volunteer: 'benevole',
  center: 'association',
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
