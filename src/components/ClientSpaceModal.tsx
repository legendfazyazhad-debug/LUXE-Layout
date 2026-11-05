import React, { useState } from 'react';
import { X, Crown, CreditCard, Package, LogIn, LogOut, Check, Sparkles, Mail } from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logout } from '../lib/auth-workspace';
import { OrderRecord, SavedPaymentMethod, UserVIPProfile } from '../types';

interface ClientSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  vipProfile: UserVIPProfile;
  orders: OrderRecord[];
  onOpenSalonModal: () => void;
  onOpenConcierge: () => void;
  onOpenVipGmail: () => void;
}

export const ClientSpaceModal: React.FC<ClientSpaceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  vipProfile,
  orders,
  onOpenSalonModal,
  onOpenConcierge,
  onOpenVipGmail,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'cards' | 'privileges'>('profile');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await googleSignIn();
    } catch (err: any) {
      console.warn('Google sign-in status:', err);
      setAuthError('Authentication notice: You may continue in guest patron mode or re-attempt.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const defaultCards: SavedPaymentMethod[] = [
    {
      id: 'card-1',
      userId: vipProfile.uid,
      cardholderName: vipProfile.displayName,
      cardBrand: 'American Express Centurion',
      last4: '3008',
      expiry: '08/29',
      isDefault: true,
      billingCity: 'New York',
      billingCountry: 'United States',
    },
    {
      id: 'card-2',
      userId: vipProfile.uid,
      cardholderName: vipProfile.displayName,
      cardBrand: 'Visa Infinite Private',
      last4: '9211',
      expiry: '11/28',
      isDefault: false,
      billingCity: 'Paris',
      billingCountry: 'France',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#141413]/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FAF9F6] border border-[#E8E4DD] shadow-2xl rounded-xs overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E4DD] flex items-center justify-between bg-[#F7F4EE]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] bg-[#FAF3E0]">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-2xl text-[#141413] tracking-wide">
                Espace Client · VIP Patron Suite
              </h2>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#7A756D]">
                Maison Aurelia · Luxe Layout Privileges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#736F68] hover:text-[#141413] transition-colors cursor-pointer"
            aria-label="Close client space"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#E8E4DD] bg-[#FAF9F6] flex gap-6 text-[11px] tracking-[0.2em] uppercase font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent text-[#7A756D] hover:text-[#141413]'
            }`}
          >
            Patron Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent text-[#7A756D] hover:text-[#141413]'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'cards'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent text-[#7A756D] hover:text-[#141413]'
            }`}
          >
            Payment Vault
          </button>
          <button
            onClick={() => setActiveTab('privileges')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'privileges'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent text-[#7A756D] hover:text-[#141413]'
            }`}
          >
            Tier Privileges
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {authError && (
            <div className="p-3 bg-[#FAF3E0] text-xs text-[#8C7A58] border border-[#D4AF37]/30">
              {authError}
            </div>
          )}

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#F5EFEB] border border-[#E8E4DD] rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C7A58] font-medium">
                    Verified Tier
                  </span>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif-luxury text-3xl text-[#141413]">
                      {currentUser?.displayName || vipProfile.displayName}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-[#141413] text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-sans">
                      {vipProfile.clientTier}
                    </span>
                  </div>
                  <p className="text-xs text-[#736F68] font-sans">
                    {currentUser?.email || vipProfile.email} · Preferred Salon:{' '}
                    <strong>{vipProfile.preferredSalon}</strong>
                  </p>
                </div>

                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onOpenVipGmail}
                      className="px-4 py-2 bg-[#141413] text-[#FAF9F6] text-xs uppercase tracking-wider hover:bg-[#2C2926] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Salon Gmail</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 border border-[#141413] text-[#141413] text-xs uppercase tracking-widest hover:bg-[#141413] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="gsi-material-button flex items-center gap-3 px-5 py-2.5 bg-white border border-[#747775] rounded-md shadow-xs hover:bg-[#F8FAFC] transition-colors cursor-pointer font-sans text-xs font-medium text-[#1F1F1F]"
                  >
                    <div className="w-4 h-4 shrink-0">
                      <svg viewBox="0 0 48 48" className="w-full h-full">
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                    </div>
                    <span>
                      {isSigningIn ? 'Authenticating...' : 'Sign in with Google'}
                    </span>
                  </button>
                )}
              </div>

              {/* Spend & Tier Progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#736F68]">Completed Lifetime Spend</span>
                  <span className="font-semibold text-[#141413] tabular-nums">
                    ${vipProfile.completedSpend.toLocaleString()} USD / $30,000 for Permanent Salon Key
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E8E4DD] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#141413]"
                    style={{
                      width: `${Math.min(100, (vipProfile.completedSpend / 30000) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#7A756D]">
                  Tier automatically unlocks private courier hand-deliveries, atelier preview locks,
                  and direct salon director communications.
                </p>
              </div>

              {/* 3 Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E4DD]">
                <button
                  onClick={onOpenVipGmail}
                  className="p-4 bg-white border border-[#E8E4DD] hover:border-[#141413] transition-colors text-left space-y-1 cursor-pointer"
                >
                  <p className="font-serif-luxury text-lg text-[#141413] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                    Salon Gmail
                  </p>
                  <p className="text-xs text-[#736F68]">
                    Send private invitations, fitting RSVPs, and dispatches.
                  </p>
                </button>

                <button
                  onClick={onOpenSalonModal}
                  className="p-4 bg-white border border-[#E8E4DD] hover:border-[#141413] transition-colors text-left space-y-1 cursor-pointer"
                >
                  <p className="font-serif-luxury text-lg text-[#141413]">Book Private Fitting</p>
                  <p className="text-xs text-[#736F68]">
                    Reserve 1-on-1 session at Place Vendôme or Madison Ave.
                  </p>
                </button>

                <button
                  onClick={onOpenConcierge}
                  className="p-4 bg-white border border-[#E8E4DD] hover:border-[#141413] transition-colors text-left space-y-1 cursor-pointer"
                >
                  <p className="font-serif-luxury text-lg text-[#141413] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Maison Stylist Desk
                  </p>
                  <p className="text-xs text-[#736F68]">
                    Live direct consultation with Madame Vance.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-[#736F68] space-y-2">
                  <Package className="w-8 h-8 mx-auto stroke-1 text-[#8C7A58]" />
                  <p className="font-serif-luxury text-xl text-[#141413]">No acquisitions recorded</p>
                  <p className="text-xs">Your completed purchases will be archived securely here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 bg-white border border-[#E8E4DD] rounded-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E8E4DD] pb-3">
                      <div>
                        <span className="font-serif-luxury text-lg text-[#141413]">
                          Order {order.orderId}
                        </span>
                        <p className="text-[11px] text-[#736F68] font-sans mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}{' '}
                          · Ref: {order.paymentReference}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-[#FAF3E0] text-[#8C7A58] border border-[#D4AF37]/30 text-[10px] tracking-wider uppercase font-sans font-medium">
                          {order.paymentStatus}
                        </span>
                        <span className="font-sans font-semibold text-base text-[#141413] tabular-nums">
                          ${order.totalAmount.toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-[#5C5750] flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <p>
                          <strong>Payment:</strong> {order.paymentMethod} (•••• {order.cardLast4})
                        </p>
                        <p>
                          <strong>Destination:</strong> {order.shippingAddress}
                        </p>
                      </div>
                      <div className="text-right sm:text-left">
                        <span className="inline-block px-2 py-0.5 bg-[#FAF9F6] border border-[#E8E4DD] text-[10px] tracking-widest uppercase">
                          {order.itemCount} {order.itemCount === 1 ? 'Piece' : 'Pieces'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT VAULT */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <p className="text-xs text-[#736F68]">
                Your tokenized luxury payment instruments are stored under PCI DSS Level 1 compliance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defaultCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-5 bg-gradient-to-br from-[#1C1B1A] to-[#2C2926] text-white rounded-xs shadow-md space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-widest text-[#D4AF37]">
                        {card.cardBrand}
                      </span>
                      {card.isDefault && (
                        <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 bg-white/10 rounded-full text-white/80">
                          Primary
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-lg tracking-[0.2em] py-2">
                      •••• •••• •••• {card.last4}
                    </div>

                    <div className="flex justify-between text-[11px] text-white/70 uppercase tracking-wider font-sans">
                      <div>
                        <span className="text-[9px] block text-white/40">Cardholder</span>
                        <span>{card.cardholderName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] block text-white/40">Expires</span>
                        <span>{card.expiry}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TIER PRIVILEGES */}
          {activeTab === 'privileges' && (
            <div className="space-y-4">
              <div className="p-5 bg-[#FAF3E0] border border-[#D4AF37]/40 text-xs text-[#8C7A58] space-y-1">
                <p className="font-medium text-sm text-[#141413]">
                  Couture Elite Patron Status Privileges
                </p>
                <p>
                  As an elite client of Maison Aurelia · Luxe Layout, your acquisitions unlock
                  unrivaled bespoke salon access worldwide.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white border border-[#E8E4DD] space-y-2">
                  <div className="flex items-center gap-2 font-medium text-[#141413]">
                    <Check className="w-4 h-4 text-[#8C7A58]" />
                    <span>Private Salon Champagne Service</span>
                  </div>
                  <p className="text-[#736F68]">
                    Vintage Grand Cru champagne service and private salon suites during Paris, Tokyo,
                    and London visits.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E8E4DD] space-y-2">
                  <div className="flex items-center gap-2 font-medium text-[#141413]">
                    <Check className="w-4 h-4 text-[#8C7A58]" />
                    <span>White-Glove Hand Courier</span>
                  </div>
                  <p className="text-[#736F68]">
                    Personalized hand-delivery to your residence, hotel suite, or yacht anywhere
                    globally within 48 hours.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E8E4DD] space-y-2">
                  <div className="flex items-center gap-2 font-medium text-[#141413]">
                    <Check className="w-4 h-4 text-[#8C7A58]" />
                    <span>Bespoke Monogramming & Fitting</span>
                  </div>
                  <p className="text-[#736F68]">
                    Direct consultations with our Master Tailors for exact made-to-measure adjustments.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E8E4DD] space-y-2">
                  <div className="flex items-center gap-2 font-medium text-[#141413]">
                    <Check className="w-4 h-4 text-[#8C7A58]" />
                    <span>Direct Stylist Concierge & Salon Gmail</span>
                  </div>
                  <p className="text-[#736F68]">
                    24/7 dedicated line to our Paris salon director for event wardrobe curation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
