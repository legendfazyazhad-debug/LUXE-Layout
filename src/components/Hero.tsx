import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Gem } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onExploreClick: () => void;
  onBookSalonClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onBookSalonClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-[#E8E4DD]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Statement & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between py-4 lg:py-8 space-y-8">
            <div className="space-y-6">
              {/* Quiet unboxed kicker */}
              <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#7A756D]">
                <span>Maison Fondée 1928</span>
                <span aria-hidden="true">·</span>
                <span>Collection Automne-Hiver</span>
              </div>

              {/* Display Headline with balanced wrapping */}
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#141413] font-light leading-[1.08] tracking-tight">
                The Architecture of <br />
                <span className="italic font-normal">Pure Line & Silence</span>
              </h1>

              <p className="text-[15px] leading-relaxed text-[#5C5750] max-w-md font-sans">
                Each silhouette is drafted as living architecture. Crafted from double-faced
                Mongolian cashmere, Lyon silk crepe de chine, and hand-stitched French box calfskin
                inside our Place Vendôme ateliers.
              </p>
            </div>

            {/* Actions & Proof */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={onExploreClick}
                  className="px-8 py-3.5 bg-[#141413] text-[#FAF9F6] text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-[#2C2926] transition-colors flex items-center justify-center gap-3 rounded-xs cursor-pointer shadow-sm"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
                <button
                  onClick={onBookSalonClick}
                  className="px-7 py-3.5 border border-[#141413] text-[#141413] text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-[#141413] hover:text-[#FAF9F6] transition-colors text-center rounded-xs cursor-pointer"
                >
                  Book Private Salon
                </button>
              </div>

              <div className="pt-4 border-t border-[#E8E4DD] text-xs text-[#7A756D] flex items-center gap-4">
                <span>Direct delivery via white-glove courier</span>
                <span aria-hidden="true">·</span>
                <span>Private fitting suites</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Campaign Editorial Visual */}
          <div className="lg:col-span-7 relative min-h-[460px] lg:min-h-[600px] rounded-xs overflow-hidden bg-[#ECE8E1] group">
            <img
              src={HERO_IMAGE}
              alt="Luxe Layout Haute Couture Editorial Campaign Silhouette"
              className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Subtle luxury vignette gradient overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/70 via-[#141413]/10 to-transparent pointer-events-none" />

            {/* In-image caption stamp */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[#FAF9F6]">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-1">
                  Campagne Haute Couture N° XII
                </p>
                <p className="font-serif-luxury text-xl lg:text-2xl text-white font-light tracking-wide">
                  Le Manteau Sculptural en Laine Ivoire
                </p>
              </div>
              <button
                onClick={onExploreClick}
                className="hidden sm:inline-flex text-[11px] tracking-[0.2em] uppercase text-white/90 hover:text-white underline underline-offset-4 decoration-[#D4AF37] cursor-pointer"
              >
                View Piece
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Heritage Ribbon */}
        <div className="mt-12 pt-8 border-t border-[#E8E4DD] grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-[#141413]">
          <div className="flex items-start gap-3.5">
            <Compass className="w-5 h-5 text-[#8C7A58] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-medium text-[#141413]">
                Place Vendôme Atelier
              </p>
              <p className="text-[12px] text-[#736F68] mt-0.5">Hand-cut & finished in Paris 8e</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <Gem className="w-5 h-5 text-[#8C7A58] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-medium text-[#141413]">
                Noble Raw Materials
              </p>
              <p className="text-[12px] text-[#736F68] mt-0.5">100% Traceable grade A cashmere</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#8C7A58] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-medium text-[#141413]">
                White-Glove Delivery
              </p>
              <p className="text-[12px] text-[#736F68] mt-0.5">Complimentary insured global courier</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-5 h-5 rounded-full border border-[#8C7A58] flex items-center justify-center text-[10px] font-serif-luxury font-bold text-[#8C7A58] shrink-0 mt-0.5">
              LL
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-medium text-[#141413]">
                Private Salon Fittings
              </p>
              <p className="text-[12px] text-[#736F68] mt-0.5">Paris, Ginza, Mayfair & Madison</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
