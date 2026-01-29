import { create } from 'zustand';
import { authAPI } from '../api/auth';
import { endpointsAPI } from '../api/endpoints';

const getInitialState = () => {
  try {
    const persisted = localStorage.getItem('appState');
    return persisted ? JSON.parse(persisted) : {};
  } catch {
    return {};
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('appState', JSON.stringify({
      endpoints: state.endpoints,
      selectedEndpoint: state.selectedEndpoint
    }));
  } catch (error) {
    console.error('Failed to persist state:', error);
  }
};

export const useStore = create((set, get) => {
  const initialState = getInitialState();
  
  return {
    // Auth
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    
    login: async (credentials) => {
      try {
        const { data } = await authAPI.login(credentials);
        // Clear any stale persisted data first
        localStorage.removeItem('appState');
        // Set new auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        set({ 
          user: data.user, 
          token: data.token,
          endpoints: [],
          selectedEndpoint: null
        });
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    
    register: async (userData) => {
      try {
        const { data } = await authAPI.register(userData);
        // Clear any stale persisted data first
        localStorage.removeItem('appState');
        // Set new auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        set({ 
          user: data.user, 
          token: data.token,
          endpoints: [],
          selectedEndpoint: null
        });
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    
    logout: () => {
      localStorage.clear();
      set({ user: null, token: null, endpoints: [], selectedEndpoint: null });
    },
    
    // Endpoints
    endpoints: initialState.endpoints || [],
    selectedEndpoint: initialState.selectedEndpoint || null,
    
    fetchEndpoints: async () => {
      try {
        const { data } = await endpointsAPI.getAll();
        set((state) => {
          const newState = { endpoints: data.data };
          saveState({ ...state, ...newState });
          return newState;
        });
        return data.data;
      } catch (error) {
        console.error('Failed to fetch endpoints:', error);
        throw error;
      }
    },
    
    fetchEndpoint: async (id) => {
      try {
        const { data } = await endpointsAPI.getById(id);
        const selectedEndpoint = data.data;
        set((state) => {
          const newState = { selectedEndpoint };
          saveState({ ...state, ...newState });
          return newState;
        });
        return selectedEndpoint;
      } catch (error) {
        console.error('Failed to fetch endpoint:', error);
        throw error;
      }
    },
    
    createEndpoint: async (endpointData) => {
      try {
        const { data } = await endpointsAPI.create(endpointData);
        set((state) => {
          const newState = { endpoints: [data.data, ...state.endpoints] };
          saveState({ ...state, ...newState });
          return newState;
        });
      } catch (error) {
        console.error('Failed to create endpoint:', error);
        throw error;
      }
    },
    
    updateEndpoint: async (id, endpointData) => {
      try {
        const { data } = await endpointsAPI.update(id, endpointData);
        set((state) => {
          const newState = {
            endpoints: state.endpoints.map(e => e._id === id ? data.data : e),
            selectedEndpoint: state.selectedEndpoint?._id === id ? data.data : state.selectedEndpoint
          };
          saveState({ ...state, ...newState });
          return newState;
        });
      } catch (error) {
        console.error('Failed to update endpoint:', error);
        throw error;
      }
    },
    
    deleteEndpoint: async (id) => {
      try {
        await endpointsAPI.delete(id);
        set((state) => {
          const newState = {
            endpoints: state.endpoints.filter(e => e._id !== id),
            selectedEndpoint: state.selectedEndpoint?._id === id ? null : state.selectedEndpoint
          };
          saveState({ ...state, ...newState });
          return newState;
        });
      } catch (error) {
        console.error('Failed to delete endpoint:', error);
        throw error;
      }
    },
    
    toggleEndpoint: async (id) => {
      try {
        const { data } = await endpointsAPI.toggle(id);
        set((state) => {
          const newState = {
            endpoints: state.endpoints.map(e => e._id === id ? data.data : e),
            selectedEndpoint: state.selectedEndpoint?._id === id ? data.data : state.selectedEndpoint
          };
          saveState({ ...state, ...newState });
          return newState;
        });
      } catch (error) {
        console.error('Failed to toggle endpoint:', error);
        throw error;
      }
    },
    
    clearSelectedEndpoint: () => {
      set((state) => {
        const newState = { selectedEndpoint: null };
        saveState({ ...state, ...newState });
        return newState;
      });
    }
  };
});