
import { writable } from 'svelte/store';

export const user = writable(null);
export const isLoggedIn = writable(false);
export const gyms = writable([]);
export const members = writable([]);

// Initialize user from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  
  if (token && userData) {
    try {
      user.set(JSON.parse(userData));
      isLoggedIn.set(true);
    } catch (e) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }
}
