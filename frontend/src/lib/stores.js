
import { writable } from 'svelte/store';

export const user = writable(null);
export const selectedGym = writable(null);
export const isAuthenticated = writable(false);

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  if (token) {
    isAuthenticated.set(true);
    // You might want to validate the token here
  }
}
