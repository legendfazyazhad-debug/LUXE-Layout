export type CategoryType = 
  | 'all'
  | 'outerwear'
  | 'leather-goods'
  | 'evening-dresses'
  | 'horlogerie-jewelry';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryType;
  categoryLabel: string;
  price: number;
  currency: string;
  image: string;
  secondaryImage?: string;
  description: string;
  details: string[];
  fabrication: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  isExclusive?: boolean;
  isNewSeason?: boolean;
  limitedEdition?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface OrderRecord {
  orderId: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  paymentStatus: 'Settled / Confirmed' | 'Processing' | 'Authorized';
  paymentMethod: string;
  paymentReference: string;
  cardBrand: string;
  cardLast4: string;
  itemCount: number;
  items: string; // JSON string or summary
  shippingAddress: string;
  createdAt: string;
}

export interface UserVIPProfile {
  uid: string;
  email: string;
  displayName: string;
  clientTier: 'Silver' | 'Gold' | 'Platinum' | 'Couture Elite';
  completedSpend: number;
  preferredSalon: string;
  phone: string;
  createdAt: string;
}

export interface SavedPaymentMethod {
  id: string;
  userId: string;
  cardholderName: string;
  cardBrand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  billingCity: string;
  billingCountry: string;
}

export interface ConciergeMessage {
  id: string;
  userId: string;
  sender: 'member' | 'stylist' | 'system';
  stylistName: string;
  stylistRole: string;
  text: string;
  referencedProduct?: string;
  timestamp: string;
  isRead: boolean;
}

export interface SalonBooking {
  id: string;
  salonLocation: string;
  date: string;
  timeSlot: string;
  consultationType: 'Haute Couture Fitting' | 'Bespoke Tailoring' | 'Private Jewelry Presentation' | 'Personal Styling';
  guestCount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  specialRequests: string;
}
