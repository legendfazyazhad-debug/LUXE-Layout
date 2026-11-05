import React, { useState } from 'react';
import { X, Check, Shield, Sparkles, Truck, Ruler, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onOpenConciergeWithProduct: (product: Product) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenConciergeWithProduct,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0]
  );
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'services'>('details');
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#141413]/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Modal Surface */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#FAF9F6] border border-[#E8E4DD] shadow-2xl rounded-xs overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#141413] hover:text-[#8C7A58] bg-white/80 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Gallery Visual Slot */}
        <div className="w-full md:w-1/2 bg-[#F2EFE9] relative overflow-hidden min-h-[320px] md:min-h-[560px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {product.limitedEdition && (
            <div className="absolute top-4 left-4 bg-[#141413] text-[#FAF9F6] text-[10px] tracking-[0.25em] uppercase px-3 py-1 font-sans">
              {product.limitedEdition}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 text-xs text-[#5C5750] flex items-center justify-between border border-white/40">
            <span>Place Vendôme Atelier Series</span>
            <span className="text-[#8C7A58] font-medium">Bespoke Monogramming Available</span>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[520px] md:max-h-[580px]">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-[#7A756D] mb-1.5">
                <span>{product.categoryLabel}</span>
                <span className="text-[#8C7A58]">Ref. {product.id.toUpperCase()}</span>
              </div>

              <h2 className="font-serif-luxury text-2xl lg:text-3xl text-[#141413] font-normal leading-tight">
                {product.name}
              </h2>

              <p className="text-sm text-[#736F68] mt-1 font-sans">
                {product.subtitle}
              </p>

              <div className="mt-4 flex items-baseline gap-4">
                <span className="font-sans text-2xl font-semibold text-[#141413] tabular-nums">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-xs text-[#7A756D]">
                  Inclusive of import duties & insured white-glove transport
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.18em] uppercase text-[#4A4742] font-medium flex items-center justify-between">
                <span>Nuance / Shade</span>
                <span className="text-[#736F68] font-normal">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-3 py-1.5 border text-xs transition-all cursor-pointer rounded-xs ${
                      selectedColor.name === color.name
                        ? 'border-[#141413] bg-[#EFECE6] text-[#141413] font-medium ring-1 ring-[#141413]'
                        : 'border-[#E8E4DD] text-[#736F68] hover:border-[#B5AEA4]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] tracking-[0.18em] uppercase text-[#4A4742] font-medium">
                  Atelier Sizing
                </label>
                <button
                  type="button"
                  onClick={() => onOpenConciergeWithProduct(product)}
                  className="text-xs text-[#8C7A58] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Sizing consultation</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2 text-xs text-center border transition-all cursor-pointer rounded-xs ${
                      selectedSize === size
                        ? 'border-[#141413] bg-[#141413] text-[#FAF9F6] font-medium'
                        : 'border-[#E8E4DD] text-[#4A4742] hover:border-[#141413]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Contiguous Action Module */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 py-3.5 px-6 bg-[#141413] text-[#FAF9F6] text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-[#2C2926] transition-colors flex items-center justify-center gap-2 rounded-xs shadow-sm cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <span>Add to Shopping Bag</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3.5 border border-[#E8E4DD] rounded-xs hover:border-[#141413] transition-colors cursor-pointer ${
                    isWishlisted ? 'text-[#8C7A58] bg-[#FAF3E0]' : 'text-[#736F68]'
                  }`}
                  title="Add to Wishlist"
                  aria-label="Wishlist piece"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Speak with Stylist Direct Link */}
              <button
                type="button"
                onClick={() => onOpenConciergeWithProduct(product)}
                className="w-full py-2.5 px-4 border border-[#B5AEA4] text-[#141413] text-[11px] tracking-[0.18em] uppercase hover:bg-[#ECE8E1] transition-colors flex items-center justify-center gap-2 rounded-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Request Private Styling Consultation</span>
              </button>
            </div>

            {/* Interactive Details Accordion Tabs */}
            <div className="border-t border-[#E8E4DD] pt-4">
              <div className="flex items-center gap-6 text-[11px] tracking-[0.18em] uppercase font-medium border-b border-[#E8E4DD] pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
                    activeTab === 'details'
                      ? 'border-b-2 border-[#141413] text-[#141413]'
                      : 'text-[#8A857D] hover:text-[#141413]'
                  }`}
                >
                  Savoir-Faire
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('materials')}
                  className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
                    activeTab === 'materials'
                      ? 'border-b-2 border-[#141413] text-[#141413]'
                      : 'text-[#8A857D] hover:text-[#141413]'
                  }`}
                >
                  Materials & Origin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${
                    activeTab === 'services'
                      ? 'border-b-2 border-[#141413] text-[#141413]'
                      : 'text-[#8A857D] hover:text-[#141413]'
                  }`}
                >
                  Maison Services
                </button>
              </div>

              <div className="pt-3 text-xs leading-relaxed text-[#5C5750]">
                {activeTab === 'details' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {product.details.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                {activeTab === 'materials' && (
                  <div className="space-y-2">
                    <p>
                      <strong>Composition:</strong> {product.fabrication}
                    </p>
                    <p>
                      Traceability verified by the Chambre Syndicale de la Haute Couture.
                      Treated with zero hazardous chemicals, preserving the noble hand-feel.
                    </p>
                  </div>
                )}
                {activeTab === 'services' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#8C7A58]" />
                      <span>Complimentary white-glove courier delivery & collection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#8C7A58]" />
                      <span>Lifetime atelier garment care and alteration privilege</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
