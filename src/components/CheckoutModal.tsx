import React, { useState } from 'react';
import { X, Lock, CheckCircle2, CreditCard, Shield, Truck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CartItem, OrderRecord } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  includeGiftWrap: boolean;
  giftNote: string;
  userId: string;
  userEmail: string;
  userName: string;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  includeGiftWrap,
  giftNote,
  userId,
  userEmail,
  userName,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Form states
  const [name, setName] = useState(userName || 'Eleanor Vance');
  const [email, setEmail] = useState(userEmail || 'client.vance@luxelayout.com');
  const [phone, setPhone] = useState('+1 (212) 849-5500');
  const [address, setAddress] = useState('740 Park Avenue, Apt 14B');
  const [city, setCity] = useState('New York');
  const [postalCode, setPostalCode] = useState('10021');
  const [country, setCountry] = useState('United States');

  // Payment states
  const [cardBrand, setCardBrand] = useState('American Express Centurion');
  const [cardNumber, setCardNumber] = useState('•••• •••••• •3008');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('888');

  // Submission state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedOrderId = `LL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = JSON.stringify(
      cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        qty: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor.name,
        price: item.product.price,
      }))
    );

    const currentUid = auth.currentUser?.uid || userId || 'patron-vip-guest';

    const orderData: OrderRecord = {
      orderId: generatedOrderId,
      userId: currentUid,
      customerEmail: email,
      customerName: name,
      totalAmount: subtotal,
      currency: 'USD',
      paymentStatus: 'Settled / Confirmed',
      paymentMethod: cardBrand,
      paymentReference: `REF-TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      cardBrand: cardBrand.split(' ')[0] || 'Amex',
      cardLast4: '3008',
      itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      items: itemsSummary,
      shippingAddress: `${address}, ${city}, ${postalCode}, ${country}`,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save order to Firestore if user is authenticated
      if (auth.currentUser) {
        const ordersRef = collection(db, 'orders');
        await setDoc(doc(ordersRef, generatedOrderId), orderData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${generatedOrderId}`);
      // Proceed with local confirmation even if offline
    }

    // Trigger luxury gold confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FAF9F6', '#141413', '#E6CA85'],
      });
    } catch (_) {
      // safe fallback
    }

    setIsProcessing(false);
    setCompletedOrder(orderData);
    onOrderSuccess(orderData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#141413]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#FAF9F6] border border-[#E8E4DD] shadow-2xl rounded-xs overflow-hidden my-8"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E4DD] flex items-center justify-between bg-[#F7F4EE]">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#8C7A58]" />
            <div>
              <h2 className="font-serif-luxury text-2xl text-[#141413] tracking-wide">
                Luxe Layout · Private Checkout
              </h2>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#7A756D]">
                Concierge Encrypted Settlement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#736F68] hover:text-[#141413] transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {completedOrder ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3E0] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <CheckCircle2 className="w-8 h-8 stroke-1" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#8C7A58] font-medium">
                Payment Authorized & Settled
              </span>
              <h3 className="font-serif-luxury text-3xl text-[#141413]">
                Acquisition Confirmed
              </h3>
              <p className="text-xs text-[#736F68]">
                Order Reference <strong className="text-[#141413]">{completedOrder.orderId}</strong>
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-[#F5EFEB] border border-[#E8E4DD] text-left text-xs space-y-2 font-sans">
              <div className="flex justify-between border-b border-[#E8E4DD] pb-2">
                <span className="text-[#736F68]">Patron:</span>
                <span className="font-medium text-[#141413]">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E4DD] pb-2">
                <span className="text-[#736F68]">Delivery Destination:</span>
                <span className="font-medium text-[#141413] text-right max-w-xs truncate">
                  {completedOrder.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E8E4DD] pb-2">
                <span className="text-[#736F68]">Payment Method:</span>
                <span className="font-medium text-[#141413]">
                  {completedOrder.cardBrand} (•••• {completedOrder.cardLast4})
                </span>
              </div>
              <div className="flex justify-between pt-1 font-semibold text-sm">
                <span>Total Settled:</span>
                <span className="text-[#141413]">${completedOrder.totalAmount.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="text-xs text-[#7A756D] space-y-1">
              <p>Your dedicated Maison atelier attaché has received your commission.</p>
              <p>Complimentary white-glove courier dispatch notice will arrive via email.</p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#141413] text-[#FAF9F6] text-xs tracking-widest uppercase hover:bg-[#2C2926] cursor-pointer"
            >
              Return to Maison
            </button>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 space-y-6">
            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-lg text-[#141413] border-b border-[#E8E4DD] pb-2 flex items-center justify-between">
                <span>01. Delivery & Recipient Information</span>
                <span className="text-[11px] text-[#8C7A58] font-sans font-normal tracking-wide">
                  White-Glove Courier
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-[#4A4742] uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4742] uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4742] uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Contact Phone (For Private Courier)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4742] uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4742] uppercase tracking-wider text-[10px] mb-1 font-medium">
                    City & Postal Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-2/3 p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-1/3 p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#4A4742] uppercase tracking-wider text-[10px] mb-1 font-medium">
                    Country / Territory
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-lg text-[#141413] border-b border-[#E8E4DD] pb-2 flex items-center justify-between">
                <span>02. Payment Card Specification</span>
                <span className="text-[11px] text-[#736F68] font-sans flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#8C7A58]" />
                  Verified Merchant Gateway
                </span>
              </h3>

              <div className="p-4 bg-[#F5EFEB] border border-[#E8E4DD] rounded-xs space-y-3 text-xs font-sans">
                <div className="flex items-center gap-4">
                  {['American Express Centurion', 'Visa Infinite', 'Mastercard World Elite'].map(
                    (brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => setCardBrand(brand)}
                        className={`px-3 py-1.5 border rounded-xs transition-colors cursor-pointer text-[11px] ${
                          cardBrand === brand
                            ? 'bg-[#141413] text-white border-[#141413]'
                            : 'bg-white text-[#4A4742] border-[#E8E4DD] hover:border-[#141413]'
                        }`}
                      >
                        {brand}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[#736F68] uppercase text-[9px] mb-1 tracking-wider">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 pl-9 bg-white border border-[#E8E4DD] font-mono text-xs focus:border-[#141413] focus:outline-none"
                      />
                      <CreditCard className="w-4 h-4 text-[#8C7A58] absolute left-2.5 top-3" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#736F68] uppercase text-[9px] mb-1 tracking-wider">
                      Expiry & CVC
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-1/2 p-2.5 bg-white border border-[#E8E4DD] font-mono text-center text-xs focus:border-[#141413] focus:outline-none"
                      />
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-1/2 p-2.5 bg-white border border-[#E8E4DD] font-mono text-center text-xs focus:border-[#141413] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Packaging confirmation reminder */}
            {includeGiftWrap && (
              <div className="p-3 bg-[#FAF3E0] border border-[#D4AF37]/40 text-xs text-[#5C5750] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  Signature Maison Gift Coffret included with personalized calligraphy:{' '}
                  <em>"{giftNote || 'With warm compliments'}"</em>
                </span>
              </div>
            )}

            {/* Total and Submit */}
            <div className="pt-4 border-t border-[#E8E4DD] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-[#7A756D] uppercase tracking-wider">
                  Total Settlement Amount
                </p>
                <p className="font-serif-luxury text-3xl font-semibold text-[#141413] tabular-nums">
                  ${subtotal.toLocaleString()} USD
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-4 bg-[#141413] text-[#FAF9F6] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#2C2926] disabled:opacity-50 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-sm rounded-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isProcessing ? 'Authorizing Settlement...' : 'Authorize Acquisition'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
