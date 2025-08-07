import { create } from 'zustand';
import axios from 'axios';
import { getBrandKits } from '../actions/brand-kit';

interface BrandKit {
  id: string;
  kit_name: string;
  logo_primary: string | null;
  // Add other brand kit properties as needed
}

interface BrandKitState {
  brandKits: BrandKit[];
  isLoading: boolean;
  error: string | null;
  fetchBrandKits: () => Promise<void>;
  addBrandKit: (newBrandKit: BrandKit) => void;
  deleteBrandKit: (id: string) => Promise<void>;
}

export const useBrandKitStore = create<BrandKitState>((set) => ({
  brandKits: [],
  isLoading: false,
  error: null,
  fetchBrandKits: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBrandKits();
      set({ brandKits: data, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching brand kits:", error);
      set({ error: error.message, isLoading: false });
    }
  },
  addBrandKit: (newBrandKit) => {
    set((state) => ({
      brandKits: [...state.brandKits, newBrandKit],
    }));
  },
  deleteBrandKit: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/brand-kit/${id}`);
      set((state) => ({
        brandKits: state.brandKits.filter((kit) => kit.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Error deleting brand kit:", error);
      set({ error: error.message, isLoading: false });
      throw error; // Re-throw to allow component to catch and show toast
    }
  },
}));
