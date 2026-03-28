import { create } from "zustand";
import { advertisers as initialAdvertisers } from "@/mocks/advertisers";
import { Advertiser } from "@/types";

interface AdvertiserState {
  advertisers: Advertiser[];
  searchQuery: string;
  selectedAreas: string[];
  addAdvertiser: (advertiser: Omit<Advertiser, "id" | "createdAt">) => void;
  updateAdvertiser: (id: string, advertiser: Partial<Advertiser>) => void;
  deleteAdvertiser: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedAreas: (areas: string[]) => void;
  filteredAdvertisers: () => Advertiser[];
  getUniqueAreas: () => string[];
}

export const useAdvertiserStore = create<AdvertiserState>((set, get) => ({
  advertisers: initialAdvertisers,
  searchQuery: "",
  selectedAreas: [],
  
  addAdvertiser: (advertiser) => {
    const newAdvertiser = {
      ...advertiser,
      id: `ad${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    set((state) => ({
      advertisers: [...state.advertisers, newAdvertiser],
    }));
  },
  
  updateAdvertiser: (id, updatedAdvertiser) => {
    set((state) => ({
      advertisers: state.advertisers.map((advertiser) =>
        advertiser.id === id ? { ...advertiser, ...updatedAdvertiser } : advertiser
      ),
    }));
  },
  
  deleteAdvertiser: (id) => {
    set((state) => ({
      advertisers: state.advertisers.filter((advertiser) => advertiser.id !== id),
    }));
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setSelectedAreas: (areas) => {
    set({ selectedAreas: areas });
  },
  
  filteredAdvertisers: () => {
    const { advertisers, searchQuery, selectedAreas } = get();
    let filtered = advertisers;
    
    // エリアフィルター
    if (selectedAreas.length > 0) {
      filtered = filtered.filter((advertiser) =>
        selectedAreas.some((area) =>
          advertiser.preferredArea.some((prefArea) =>
            prefArea.toLowerCase().includes(area.toLowerCase())
          )
        )
      );
    }
    
    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (advertiser) =>
          advertiser.name.toLowerCase().includes(query) ||
          advertiser.preferredArea.some((area) => area.toLowerCase().includes(query)) ||
          advertiser.adContent.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  },
  
  getUniqueAreas: () => {
    const { advertisers } = get();
    const areas = new Set<string>();
    
    advertisers.forEach((advertiser) => {
      advertiser.preferredArea.forEach(area => {
        if (area) areas.add(area);
      });
    });
    
    return Array.from(areas).sort();
  },
}));