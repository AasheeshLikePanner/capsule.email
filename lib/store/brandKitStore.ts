import { create } from 'zustand';

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
}

export const useBrandKitStore = create<BrandKitState>((set) => ({
  brandKits: [],
  isLoading: false,
  error: null,
  fetchBrandKits: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/brand-kit');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
}));
