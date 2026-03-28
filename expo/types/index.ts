export type SalesRep = {
  id: string;
  name: string;
  contact: string;
  area: string;
  notes: string;
  salesTotal: number;
  incentiveAmount: number;
  contractedAdvertisers: string[];
  contractedAdLocations: string[];
  createdAt: string;
};

export type AdLocation = {
  id: string;
  name: string;
  address: string;
  businessType: string;
  hasAgreement: boolean;
  contactPerson: string;
  contactInfo: string;
  createdAt: string;
};

export type Advertiser = {
  id: string;
  name: string;
  adContent: string;
  preferredArea: string[];
  period: string;
  budget: number;
  contactPerson: string;
  contactInfo: string;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  senderName: string;
  senderEmail: string;
  senderType: "advertiser" | "salesRep" | "adLocation" | "general";
  subject: string;
  content: string;
  status: "unread" | "read" | "resolved" | "pending";
  priority: "low" | "medium" | "high";
  createdAt: string;
  salesRepId?: string;
};

export type Advertisement = {
  id: string;
  adLocationId: string;
  advertiserId: string;
  advertiserName: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'current' | 'past' | 'scheduled';
  monthlyFee: number;
  createdAt: string;
};