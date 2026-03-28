import { create } from "zustand";
import { inquiries as initialInquiries } from "@/mocks/inquiries";
import { Inquiry } from "@/types";

interface InquiryState {
  inquiries: Inquiry[];
  searchQuery: string;
  statusFilter: "all" | "unread" | "read" | "resolved" | "pending";
  priorityFilter: "all" | "low" | "medium" | "high";
  senderTypeFilter: "all" | "advertiser" | "salesRep" | "adLocation" | "general";
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => void;
  deleteInquiry: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: "all" | "unread" | "read" | "resolved" | "pending") => void;
  setPriorityFilter: (priority: "all" | "low" | "medium" | "high") => void;
  setSenderTypeFilter: (senderType: "all" | "advertiser" | "salesRep" | "adLocation" | "general") => void;
  filteredInquiries: () => Inquiry[];
  getUnreadCount: () => number;
  getPendingCount: () => number;
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: initialInquiries,
  searchQuery: "",
  statusFilter: "all",
  priorityFilter: "all",
  senderTypeFilter: "all",
  
  updateInquiryStatus: (id, status) => {
    set((state) => ({
      inquiries: state.inquiries.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, status } : inquiry
      ),
    }));
  },
  
  deleteInquiry: (id) => {
    set((state) => ({
      inquiries: state.inquiries.filter((inquiry) => inquiry.id !== id),
    }));
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setStatusFilter: (status) => {
    set({ statusFilter: status });
  },
  
  setPriorityFilter: (priority) => {
    set({ priorityFilter: priority });
  },
  
  setSenderTypeFilter: (senderType) => {
    set({ senderTypeFilter: senderType });
  },
  
  filteredInquiries: () => {
    const { inquiries, searchQuery, statusFilter, priorityFilter, senderTypeFilter } = get();
    
    let filtered = inquiries;
    
    // ステータスフィルター
    if (statusFilter !== "all") {
      if (statusFilter === "pending") {
        // 未対応 = 未読 + 既読
        filtered = filtered.filter(inquiry => inquiry.status === "unread" || inquiry.status === "read");
      } else {
        filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
      }
    }
    
    // 優先度フィルター
    if (priorityFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.priority === priorityFilter);
    }
    
    // 送信者タイプフィルター
    if (senderTypeFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.senderType === senderTypeFilter);
    }
    
    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inquiry) =>
          inquiry.senderName.toLowerCase().includes(query) ||
          inquiry.subject.toLowerCase().includes(query) ||
          inquiry.senderEmail.toLowerCase().includes(query)
      );
    }
    
    // 日付順でソート（新しい順）
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  getUnreadCount: () => {
    const { inquiries } = get();
    return inquiries.filter(inquiry => inquiry.status === "unread").length;
  },
  
  getPendingCount: () => {
    const { inquiries } = get();
    return inquiries.filter(inquiry => inquiry.status === "unread" || inquiry.status === "read").length;
  },
}));