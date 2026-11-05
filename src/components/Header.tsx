import React from 'react';
import { ShoppingBag, User, Sparkles, MessageSquare, Mail, LogIn } from 'lucide-react';
import { CartItem } from '../types';
import LUXE_LOGO from '../assets/images/luxelayout_logo_hallmark_1793865614391.jpg';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenClientSpace: () => void;
  onOpenSalonModal: () => void;
  onOpenConcierge: () => void;
  onOpenVipGmail: () => void;
  onGoogleSignIn: () => void;
  userTier?: string;
  isLoggedIn?: boolean;
  userDisplayName?: string;
  userPhotoUrl?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  onOpenCart,
  onOpenClientSpace,
  onOpenSalonModal,
  onOpenConcierge,
  onOpenVipGmail,
  onGoogleSignIn,
  userTier = 'Couture Elite',
  isLoggedIn = false,
  userDisplayName,
  userPhotoUrl,
}) => {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Discreet top luxury banner */}
      <div className="bg-[#141413] text-[#FAF9F6] text-[11px] tracking-[0.25em] uppercase py-2 px-4 text-center border-b border-[#2C2926]/40 select-none">
        <div className="flex items-center justify-center gap-6">
          <span className="hidden sm:inline">Paris · Milan · Tokyo · London · New York</span>
          <span className="text-[#D4AF37] font-medium">L'Automne-Hiver Défilé & Private Salon Fittings</span>
          <button
            onClick={onOpenSalonModal}
            className="hidden md:inline underline underline-offset-4 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            Reserve Private Suite
          </button>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E4DD] transition-all">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Single element wordmark with official hallmark logo */}
          <a
            href="#"
            className="flex items-center gap-3.5 group whitespace-nowrap shrink-0 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xs overflow-hidden border border-[#D4AF37]/60 shadow-xs shrink-0 bg-[#141413]">
              <img
                src={LUXE_LOGO}
                alt="Luxe Layout Monogram Hallmark"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-2xl lg:text-3xl tracking-[0.2em] font-normal uppercase text-[#141413] group-hover:text-[#8C7A58] transition-colors leading-tight">
                Luxe Layout
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#736F68] font-sans">
                Haute Couture
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-[12px] tracking-[0.2em] uppercase font-medium text-[#4A4742]">
            <a
              href="#creations"
              className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-8 decoration-1 decoration-[#141413]"
            >
              Creations
            </a>
            <a
              href="#atelier"
              className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-8 decoration-1 decoration-[#141413]"
            >
              The Atelier
            </a>
            <button
              onClick={onOpenSalonModal}
              className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-8 decoration-1 decoration-[#141413] cursor-pointer text-left uppercase"
            >
              Private Salons
            </button>
            <button
              onClick={onOpenVipGmail}
              className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-8 decoration-1 decoration-[#141413] flex items-center gap-1.5 cursor-pointer text-left uppercase text-[#8C7A58]"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              Salon Gmail
            </button>
            <button
              onClick={onOpenClientSpace}
              className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 hover:underline hover:underline-offset-8 decoration-1 decoration-[#141413] cursor-pointer text-left uppercase"
            >
              Client Space
            </button>
          </nav>

          {/* Zone 3: 1 primary action & utility cluster */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            {/* VIP Client Account or Google Sign In Button */}
            {isLoggedIn ? (
              <button
                onClick={onOpenClientSpace}
                className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#4A4742] hover:text-[#141413] transition-colors p-1.5 rounded-sm focus:outline-none cursor-pointer"
                title="Client Space & VIP Tier"
                aria-label="Client Space"
              >
                {userPhotoUrl ? (
                  <img
                    src={userPhotoUrl}
                    alt={userDisplayName || 'Patron'}
                    className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#141413]" />
                )}
                <span className="hidden sm:inline font-sans text-xs font-medium text-[#141413]">
                  {userDisplayName ? userDisplayName.split(' ')[0] : userTier}
                </span>
              </button>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-white border border-[#D9D4CC] hover:border-[#141413] text-[#141413] text-[11px] uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-2xs"
                title="Sign in with Google"
              >
                <div className="w-3.5 h-3.5 shrink-0">
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
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden text-[10px]">Sign in</span>
              </button>
            )}

            {/* Stylist Concierge Quick Trigger */}
            <button
              onClick={onOpenConcierge}
              className="relative p-2 text-[#141413] hover:text-[#8C7A58] transition-colors focus:outline-none cursor-pointer"
              title="Speak with Maison Stylist"
              aria-label="Concierge Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Shopping Bag Button (Primary Action) */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-[#141413] text-[#FAF9F6] text-[11px] tracking-[0.2em] uppercase hover:bg-[#2C2926] transition-colors rounded-xs focus:outline-none cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              aria-label={`Shopping bag with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Bag ({totalCartCount})</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
