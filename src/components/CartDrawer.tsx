import React, { useState } from 'react';
import { X, Trash2, Gift, Lock, ArrowRight, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (includeGiftWrapping: boolean, note: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [giftNote, setGiftNote] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-[#141413]/60 backdrop-blur-xs flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E4DD] animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E8E4DD] flex items-center justify-between">
          <div>
            <h2 className="font-serif-luxury text-2xl text-[#141413] tracking-wide">
              Your Shopping Bag
            </h2>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#7A756D]">
              {totalItemCount} {totalItemCount === 1 ? 'Creation' : 'Creations'} Selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#736F68] hover:text-[#141413] transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Itemized List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E8E4DD]">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#8C7A58]">
                <Gift className="w-6 h-6 stroke-1" />
              </div>
              <p className="font-serif-luxury text-xl text-[#141413]">
                Your Shopping Bag is empty
              </p>
              <p className="text-xs text-[#736F68] max-w-xs mx-auto">
                Explore our Autumn-Winter Haute Couture & Prêt-à-Porter wardrobe to select timeless
                creations.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-[#141413] text-[#FAF9F6] text-xs tracking-widest uppercase hover:bg-[#2C2926] cursor-pointer"
              >
                Browse Creations
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedSize}-${index}`} className="py-4 flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-xs bg-[#ECE8E1] border border-[#E8E4DD] shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif-luxury text-base text-[#141413] leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-[#A39E96] hover:text-[#B91C1C] transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#736F68] space-y-0.5 mt-0.5">
                      <p>Size: {item.selectedSize}</p>
                      <p className="flex items-center gap-1.5">
                        <span>Color: {item.selectedColor.name}</span>
                        <span
                          className="w-2 h-2 rounded-full inline-block border border-black/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#E8E4DD] rounded-xs bg-white">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="p-1 hover:bg-[#FAF9F6] text-[#736F68] cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="p-1 hover:bg-[#FAF9F6] text-[#736F68] cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-sans text-sm font-semibold text-[#141413] tabular-nums">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Complimentary Luxury Packaging Box */}
          {cart.length > 0 && (
            <div className="pt-4 mt-2 space-y-3">
              <label className="flex items-start gap-3 p-3 bg-[#F4F1EB] border border-[#E8E4DD] rounded-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftWrap}
                  onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                  className="mt-0.5 accent-[#141413]"
                />
                <div className="text-xs">
                  <span className="font-medium text-[#141413] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#8C7A58]" />
                    Complimentary Maison Signature Gift Coffret
                  </span>
                  <span className="text-[#736F68] block mt-0.5">
                    Embossed ivory box, grosgrain silk ribbon, and custom wax seal.
                  </span>
                </div>
              </label>

              {includeGiftWrap && (
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-[#736F68]">
                    Personal Calligraphy Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Enter your personalized dedication or greeting..."
                    className="w-full text-xs p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                    maxLength={160}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E8E4DD] bg-[#FAF9F6] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#736F68]">
                <span>Estimated Atelier Dispatch</span>
                <span className="text-[#141413] font-medium">Complimentary 24h Express</span>
              </div>
              <div className="flex justify-between text-base font-medium text-[#141413] pt-1 border-t border-[#E8E4DD]">
                <span className="font-serif-luxury text-lg">Subtotal</span>
                <span className="font-sans font-semibold tabular-nums text-lg">
                  ${subtotal.toLocaleString()} USD
                </span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(includeGiftWrap, giftNote)}
              className="w-full py-3.5 bg-[#141413] text-[#FAF9F6] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#2C2926] transition-colors flex items-center justify-center gap-2 rounded-xs shadow-sm cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <p className="text-[10px] text-center text-[#7A756D] tracking-wide">
              Secure 256-Bit SSL Encryption · Dior / Place Vendôme Standard Guarantee
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
