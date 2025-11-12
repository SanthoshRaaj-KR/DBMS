import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      role: null,              // 'doctor', 'patient', or 'admin'
      userId: null,            // Doctor ID or Patient ID
      userName: null,          // For display
      adminPassword: null,     // Only for admin
      isLoggedIn: false,
      
      // Login function - no token needed
      login: (role, userId, userName, adminPassword = null) => set({ 
        role, 
        userId, 
        userName,
        adminPassword,
        isLoggedIn: true 
      }),
      
      // Logout function
      logout: () => set({ 
        role: null, 
        userId: null, 
        userName: null,
        adminPassword: null,
        isLoggedIn: false 
      }),
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
