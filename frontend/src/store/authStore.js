import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      refID: null,
      isAuthenticated: false,
      
      login: (token, role, refID) => set({ 
        token, 
        role, 
        refID, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        token: null, 
        role: null, 
        refID: null, 
        isAuthenticated: false 
      }),
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
