import { create } from "zustand";
import { payments as initialPayments, paymentStatusHistory as initialHistory } from "@/mocks/payments";
import { Payment, PaymentStatus, PaymentStatusHistory, PaymentSummary } from "@/types/payment";

interface PaymentState {
  payments: Payment[];
  paymentHistory: PaymentStatusHistory[];
  searchQuery: string;
  statusFilter: "all" | PaymentStatus;
  advertiserFilter: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  
  // Actions
  updatePaymentStatus: (id: string, status: PaymentStatus, notes?: string) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: "all" | PaymentStatus) => void;
  setAdvertiserFilter: (advertiser: string) => void;
  setDateRange: (start: string, end: string) => void;
  
  // Computed
  filteredPayments: () => Payment[];
  getPaymentSummary: () => PaymentSummary;
  getPaymentHistory: (paymentId: string) => PaymentStatusHistory[];
  exportToCSV: () => string;
  syncWithSupabase: () => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: initialPayments,
  paymentHistory: initialHistory,
  searchQuery: "",
  statusFilter: "all",
  advertiserFilter: "",
  dateRangeStart: "",
  dateRangeEnd: "",
  
  updatePaymentStatus: (id, status, notes) => {
    const payment = get().payments.find(p => p.id === id);
    if (!payment) return;
    
    // Add to history
    const historyEntry: PaymentStatusHistory = {
      id: `hist${Date.now()}`,
      paymentId: id,
      previousStatus: payment.status,
      newStatus: status,
      updatedBy: "管理者",
      updatedAt: new Date().toISOString(),
      notes,
    };
    
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === id 
          ? { 
              ...p, 
              status, 
              updatedAt: new Date().toISOString(),
              paidDate: status === "paid" ? new Date().toISOString().split("T")[0] : p.paidDate,
              notes: notes || p.notes,
            } 
          : p
      ),
      paymentHistory: [...state.paymentHistory, historyEntry],
    }));
  },
  
  updatePayment: (id, updatedPayment) => {
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === id 
          ? { ...payment, ...updatedPayment, updatedAt: new Date().toISOString() } 
          : payment
      ),
    }));
  },
  
  deletePayment: (id) => {
    set((state) => ({
      payments: state.payments.filter((payment) => payment.id !== id),
      paymentHistory: state.paymentHistory.filter((history) => history.paymentId !== id),
    }));
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setAdvertiserFilter: (advertiser) => set({ advertiserFilter: advertiser }),
  setDateRange: (start, end) => set({ dateRangeStart: start, dateRangeEnd: end }),
  
  filteredPayments: () => {
    const { 
      payments, 
      searchQuery, 
      statusFilter, 
      advertiserFilter,
      dateRangeStart,
      dateRangeEnd 
    } = get();
    
    let filtered = payments;
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    // Advertiser filter
    if (advertiserFilter.trim()) {
      filtered = filtered.filter(payment => 
        payment.advertiserName.toLowerCase().includes(advertiserFilter.toLowerCase())
      );
    }
    
    // Date range filter
    if (dateRangeStart) {
      filtered = filtered.filter(payment => payment.invoiceDate >= dateRangeStart);
    }
    if (dateRangeEnd) {
      filtered = filtered.filter(payment => payment.invoiceDate <= dateRangeEnd);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.advertiserName.toLowerCase().includes(query) ||
        payment.campaignName.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
  },
  
  getPaymentSummary: () => {
    const payments = get().filteredPayments();
    
    const totalInvoiced = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = payments.filter(p => p.status === "paid" || p.status === "overpaid").reduce((sum, p) => sum + p.amount, 0);
    const totalUnpaid = payments.filter(p => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0);
    const paymentRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;
    
    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      
      const monthPayments = payments.filter(p => p.invoiceDate.startsWith(monthKey));
      const monthInvoiced = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      const monthPaid = monthPayments.filter(p => p.status === "paid" || p.status === "overpaid").reduce((sum, p) => sum + p.amount, 0);
      
      monthlyTrend.push({
        month: monthKey,
        invoiced: monthInvoiced,
        paid: monthPaid,
      });
    }
    
    return {
      totalInvoiced,
      totalPaid,
      totalUnpaid,
      paymentRate,
      monthlyTrend,
    };
  },
  
  getPaymentHistory: (paymentId) => {
    return get().paymentHistory.filter(h => h.paymentId === paymentId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
  
  exportToCSV: () => {
    const payments = get().filteredPayments();
    const headers = [
      "ID", "広告主名", "キャンペーン名", "金額", "ステータス", 
      "請求日", "支払期限", "入金日", "備考"
    ];
    
    const rows = payments.map(p => [
      p.id,
      p.advertiserName,
      p.campaignName,
      p.amount.toString(),
      p.status,
      p.invoiceDate,
      p.dueDate,
      p.paidDate || "",
      p.notes || ""
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");
    
    return csvContent;
  },
  
  syncWithSupabase: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Supabaseとの同期が完了しました");
  },
}));