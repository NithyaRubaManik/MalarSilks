/**
 * Application-wide configuration and environment variables.
 * Centralized here to ensure consistency and facilitate environment-specific deployments.
 */

const DEFAULT_API_HOST = 'https://malarsilks-1.onrender.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_HOST;

export const CONFIG = {
  API: {
    BASE_URL: API_BASE_URL.replace(/\/$/, ''), // Remove trailing slash if present
    ENDPOINTS: {
      AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        SIGNUP: `${API_BASE_URL}/api/auth/signup`,
        ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
      },
      PRODUCTS: `${API_BASE_URL}/api/products`,
      ORDERS: `${API_BASE_URL}/api/orders`,
      USERS: `${API_BASE_URL}/api/users`,
    }
  },
  IMAGES: {
    // Local image hosting on port 5000 (default for backend)
    DEFAULT_HOST: API_BASE_URL.replace(/\/$/, ''), 
    // Utility to get image URL with protocol awareness
    getSecureImageUrl: (path: string) => {
      if (!path) return '/placeholder.jpg';
      if (path.startsWith('http')) {
        // Don't upgrade to https if it's localhost
        if (path.includes('localhost')) return path;
        return path.replace('http://', 'https://');
      }
      return `${CONFIG.IMAGES.DEFAULT_HOST}${path.startsWith('/') ? '' : '/'}${path}`;
    }
  }
} as const;

export default CONFIG;
