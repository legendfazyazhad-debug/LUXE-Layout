import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SALON_LOCATIONS } from '../data/products';
import LUXE_LOGO from '../assets/images/luxelayout_logo_hallmark_1793865614391.jpg';

interface FooterProps {
  onOpenSalonModal: (location?: string) => void;
  onOpenClientSpace: () => void;
  onOpenConcierge: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSalonModal,
  onOpenClientSpace,
  onOpenConcierge,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmailInput('');
        setIsSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#141413] text-[#FAF9F6] border-t border-[#2C2926] pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        {/* Top Row: Newsletter & Wordmark */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-[#2C2926]">
          {/* Brand Philosophy */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xs overflow-hidden border border-[#D4AF37]/60 bg-[#1C1B1A] shadow-sm shrink-0">
                <img
                  src={LUXE_LOGO}
                  alt="Luxe Layout Logo Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif-luxury text-3xl tracking-[0.2em] uppercase font-light text-white block leading-tight">
                  Luxe Layout
                </span>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-sans">
                  Haute Couture & Prêt-à-Porter
                </p>
              </div>
            </div>
            <p className="text-xs text-[#A8A39A] leading-relaxed max-w-sm font-sans pt-1">
              Founded in Paris. Preserving the supreme traditions of French craftsmanship, bespoke
              tailoring, and noble materiality for an international community of patrons.
            </p>
          </div>

          {/* Invitation to the Gazette Privée */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium">
                La Gazette Privée
              </p>
              <h4 className="font-serif-luxury text-xl sm:text-2xl text-white font-light mt-1">
                Receive Confidential Runway & Salon Previews
              </h4>
              <p className="text-xs text-[#8A857D] mt-1 font-sans">
                Curated quarterly dispatches from our creative director and private salon directors.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex max-w-md">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your confidential email..."
                className="flex-1 bg-[#1C1B1A] border border-[#383530] text-xs px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-6 bg-[#FAF9F6] text-[#141413] text-xs uppercase tracking-widest font-medium hover:bg-[#D4AF37] hover:text-[#141413] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Inscribed</span>
                  </>
                ) : (
                  <>
                    <span>Inscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Middle Row: Global Salons & Direct Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs font-sans">
          {/* Flagship Boutiques */}
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] font-medium">
              Global Flagship Salons
            </p>
            <ul className="space-y-3 text-[#A8A39A]">
              {SALON_LOCATIONS.map((salon) => (
                <li key={salon.city}>
                  <button
                    onClick={() => onOpenSalonModal(salon.city)}
                    className="hover:text-white transition-colors text-left cursor-pointer group"
                  >
                    <span className="font-medium text-white block group-hover:text-[#D4AF37]">
                      {salon.city}
                    </span>
                    <span className="text-[11px] text-[#736F68] block">{salon.address}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Services */}
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] font-medium">
              Client Space & Care
            </p>
            <ul className="space-y-2 text-[#A8A39A]">
              <li>
                <button
                  onClick={onOpenClientSpace}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  VIP Patron Suite & Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConcierge}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Direct Stylist Desk (Madame Vance)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSalonModal()}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Private Fitting Suite Bookings
                </button>
              </li>
              <li>
                <span className="text-[#736F68]">Complimentary Global White-Glove Courier</span>
              </li>
              <li>
                <span className="text-[#736F68]">Bespoke Monogramming & Alterations</span>
              </li>
            </ul>
          </div>

          {/* Haute Couture Heritage */}
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] font-medium">
              The Maison
            </p>
            <ul className="space-y-2 text-[#A8A39A]">
              <li>
                <a href="#atelier" className="hover:text-white transition-colors">
                  Atelier Savoir-Faire (Place Vendôme)
                </a>
              </li>
              <li>
                <a href="#creations" className="hover:text-white transition-colors">
                  Autumn-Winter Prêt-à-Porter
                </a>
              </li>
              <li>
                <span className="text-[#736F68]">100% Traceable Mongolian Cashmere Guild</span>
              </li>
              <li>
                <span className="text-[#736F68]">French Tanneries d'Annonay Partnership</span>
              </li>
              <li>
                <span className="text-[#736F68]">Chambre Syndicale de la Haute Couture</span>
              </li>
            </ul>
          </div>

          {/* Legal & Direct Contacts */}
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#D4AF37] font-medium">
              Maison Contacts
            </p>
            <div className="space-y-2 text-[#A8A39A]">
              <p>
                <strong>Central Switchboard:</strong> <br />
                +33 1 42 68 00 24
              </p>
              <p>
                <strong>Patron Concierge Email:</strong> <br />
                concierge@luxelayout.com
              </p>
              <p>
                <strong>Press & Editorial Inquiries:</strong> <br />
                presse@luxelayout.paris
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quiet Copyright */}
        <div className="pt-8 border-t border-[#2C2926] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7A756D] font-sans">
          <p>© {new Date().getFullYear()} Luxe Layout · Maison de Haute Couture. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Confidentiality & Privacy</span>
            <span aria-hidden="true">·</span>
            <span>Legal Notice</span>
            <span aria-hidden="true">·</span>
            <span>Ethics & Traceability Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
