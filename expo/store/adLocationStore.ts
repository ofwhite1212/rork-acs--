import { create } from "zustand";
import { adLocations as initialAdLocations } from "@/mocks/adLocations";
import { AdLocation } from "@/types";

interface AdLocationState {
  adLocations: AdLocation[];
  searchQuery: string;
  selectedAreas: string[];
  addAdLocation: (adLocation: Omit<AdLocation, "id" | "createdAt">) => void;
  updateAdLocation: (id: string, adLocation: Partial<AdLocation>) => void;
  deleteAdLocation: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedAreas: (areas: string[]) => void;
  getAvailableAreas: () => string[];
  filteredAdLocations: () => AdLocation[];
}

export const useAdLocationStore = create<AdLocationState>((set, get) => ({
  adLocations: initialAdLocations,
  searchQuery: "",
  selectedAreas: [],
  
  addAdLocation: (adLocation) => {
    const newAdLocation = {
      ...adLocation,
      id: `al${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    set((state) => ({
      adLocations: [...state.adLocations, newAdLocation],
    }));
  },
  
  updateAdLocation: (id, updatedAdLocation) => {
    set((state) => ({
      adLocations: state.adLocations.map((location) =>
        location.id === id ? { ...location, ...updatedAdLocation } : location
      ),
    }));
  },
  
  deleteAdLocation: (id) => {
    set((state) => ({
      adLocations: state.adLocations.filter((location) => location.id !== id),
    }));
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setSelectedAreas: (areas) => {
    set({ selectedAreas: areas });
  },
  
  getAvailableAreas: () => {
    const { adLocations } = get();
    const areas = adLocations.map(location => {
      const addressParts = location.address.split('区');
      if (addressParts.length > 1) {
        return addressParts[0].split('都')[1] + '区';
      }
      return location.address.split('市')[0] + '市';
    });
    return [...new Set(areas)].sort();
  },
  
  filteredAdLocations: () => {
    const { adLocations, searchQuery, selectedAreas } = get();
    let filtered = adLocations;
    
    // エリアフィルター
    if (selectedAreas.length > 0) {
      filtered = filtered.filter(location => 
        selectedAreas.some(area => location.address.includes(area))
      );
    }
    
    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(query) ||
          location.address.toLowerCase().includes(query) ||
          location.businessType.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  },
}));