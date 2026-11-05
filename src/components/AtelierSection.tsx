import React from 'react';
import { Compass, Sparkles, Scissors, Clock } from 'lucide-react';

interface AtelierSectionProps {
  onOpenSalonModal: () => void;
  onOpenConcierge: () => void;
}

export const AtelierSection: React.FC<AtelierSectionProps> = ({
  onOpenSalonModal,
  onOpenConcierge,
}) => {
  return (
    <section id="atelier" className="py-20 bg-[#F4F1EA] border-t border-[#E8E4DD]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#7A756D]">
            <span>Place Vendôme · Paris</span>
            <span aria-hidden="true">·</span>
            <span>Artisanal Heritage</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#141413] font-light leading-tight">
            The Living Savoir-Faire of <br />
            <span className="italic font-normal">Haute Couture Tailoring</span>
          </h2>

          <p className="text-sm leading-relaxed text-[#5C5750] font-sans">
            Every creation at Luxe Layout begins with a single line sketched on tracing parchment.
            Our master tailors and leather artisans preserve rare hand techniques dating back to
            the 18th-century French guild system, executed exclusively in numbered atelier series.
          </p>
        </div>

        {/* 3 Pillars of Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 01 */}
          <div className="p-8 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xs space-y-4 hover:border-[#141413] transition-colors">
            <span className="font-serif-luxury text-2xl text-[#8C7A58] block">01</span>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#141413]" />
              <h3 className="font-serif-luxury text-xl text-[#141413] font-medium">
                The Floating Canvas Foundation
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#6B665E] font-sans">
              Unlike industrial garments that rely on fused glue, our jackets feature a free-floating
              horsehair canvas chest piece that gently shapes to the patron’s unique posture over
              time, ensuring an immaculate silhouette that breathes naturally.
            </p>
            <div className="pt-2 text-[11px] text-[#8C7A58] uppercase tracking-wider font-mono">
              84 Hours of Handwork Per Garment
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="p-8 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xs space-y-4 hover:border-[#141413] transition-colors">
            <span className="font-serif-luxury text-2xl text-[#8C7A58] block">02</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#141413]" />
              <h3 className="font-serif-luxury text-xl text-[#141413] font-medium">
                Rare Noble Provenance
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#6B665E] font-sans">
              From organic grade-A Mongolian cashmere to four-ply Lyon silk crepe de chine and
              vegetable-tanned Annonay box calfskin, every raw material is 100% traceable to source
              herds and historic European family tanneries.
            </p>
            <div className="pt-2 text-[11px] text-[#8C7A58] uppercase tracking-wider font-mono">
              Certified Traceable Sustainability
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="p-8 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xs space-y-4 hover:border-[#141413] transition-colors">
            <span className="font-serif-luxury text-2xl text-[#8C7A58] block">03</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#141413]" />
              <h3 className="font-serif-luxury text-xl text-[#141413] font-medium">
                The Private Salon Protocol
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#6B665E] font-sans">
              Patrons enjoy private fitting salons overlooking Place Vendôme in Paris, Ginza in Tokyo,
              and Madison Avenue in New York. Enjoy vintage champagne service while master cutters
              measure down to the millimeter.
            </p>
            <div className="pt-2 text-[11px] text-[#8C7A58] uppercase tracking-wider font-mono">
              By Private Appointment Only
            </div>
          </div>
        </div>

        {/* Banner with Consultation CTA */}
        <div className="p-8 lg:p-12 bg-[#141413] text-[#FAF9F6] rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-medium">
              Made-to-Measure & Bespoke Commissions
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light">
              Experience the Intimacy of a Private Atelier Fitting
            </h3>
            <p className="text-xs text-[#A8A39A] leading-relaxed font-sans">
              Our salon directors in Paris, London, Tokyo, and New York are at your disposal for
              gala attire, bridal commissions, and wardrobe curation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button
              onClick={onOpenSalonModal}
              className="px-7 py-3.5 bg-[#FAF9F6] text-[#141413] text-xs uppercase tracking-widest font-medium hover:bg-white transition-colors cursor-pointer"
            >
              Reserve Salon Suite
            </button>
            <button
              onClick={onOpenConcierge}
              className="px-7 py-3.5 border border-[#8C7A58] text-[#FAF9F6] text-xs uppercase tracking-widest font-medium hover:bg-white/10 transition-colors cursor-pointer"
            >
              Consult Salon Director
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
