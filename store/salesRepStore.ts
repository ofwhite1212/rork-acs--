import { create } from "zustand";
import { salesReps as initialSalesReps } from "@/mocks/salesReps";
import { SalesRep } from "@/types";

interface SalesRepState {
  salesReps: SalesRep[];
  searchQuery: string;
  addSalesRep: (salesRep: Omit<SalesRep, "id" | "createdAt">) => void;
  updateSalesRep: (id: string, salesRep: Partial<SalesRep>) => void;
  deleteSalesRep: (id: string) => void;
  setSearchQuery: (query: string) => void;
  filteredSalesReps: () => SalesRep[];
}

export const useSalesRepStore = create<SalesRepState>((set, get) => ({
  salesReps: initialSalesReps,
  searchQuery: "",
  
  addSalesRep: (salesRep) => {
    const newSalesRep = {
      ...salesRep,
      id: `sr${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    set((state) => ({
      salesReps: [...state.salesReps, newSalesRep],
    }));
  },
  
  updateSalesRep: (id, updatedSalesRep) => {
    set((state) => ({
      salesReps: state.salesReps.map((rep) =>
        rep.id === id ? { ...rep, ...updatedSalesRep } : rep
      ),
    }));
  },
  
  deleteSalesRep: (id) => {
    set((state) => ({
      salesReps: state.salesReps.filter((rep) => rep.id !== id),
    }));
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  filteredSalesReps: () => {
    const { salesReps, searchQuery } = get();
    if (!searchQuery.trim()) return salesReps;
    
    const query = searchQuery.toLowerCase();
    return salesReps.filter(
      (rep) =>
        rep.name.toLowerCase().includes(query) ||
        rep.area.toLowerCase().includes(query) ||
        rep.contact.includes(query)
    );
  },
}));