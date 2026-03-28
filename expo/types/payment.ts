export type PaymentStatus = "unpaid" | "pending" | "paid" | "overpaid";

export type Payment = {
  id: string;
  advertiserId: string;
  advertiserName: string;
  area: string;
  campaignName: string;
  amount: number;
  status: PaymentStatus;
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  invoiceUrl?: string;
  notes?: string;
  contractStartDate: string;
  contractPeriod: string;
  contractStoreCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PaymentStatusHistory = {
  id: string;
  paymentId: string;
  previousStatus: PaymentStatus;
  newStatus: PaymentStatus;
  updatedBy: string;
  updatedAt: string;
  notes?: string;
};

export type PaymentSummary = {
  totalInvoiced: number;
  totalPaid: number;
  totalUnpaid: number;
  paymentRate: number;
  monthlyTrend: Array<{
    month: string;
    invoiced: number;
    paid: number;
  }>;
};