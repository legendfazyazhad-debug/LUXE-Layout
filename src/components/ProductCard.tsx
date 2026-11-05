import React, { useState } from 'react';
import { Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, product.sizes[0] || 'Standard', selectedColor);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 2000);
  };

  return (
    <article
      onClick={() => onQuickView(product)}
      className="group cursor-pointer flex flex-col bg-[#FAF9F6] border border-[#E8E4DD] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Visual Slot */}
      <div className="relative aspect-[4/3] bg-[#F2EFE9] overflow-hidden">
        {imageLoaded ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageLoaded(false)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#EBE7DF] text-[#736F68] p-6 text-center">
            <span className="font-serif-luxury text-xl text-[#141413]">{product.name}</span>
            <span className="text-[11px] uppercase tracking-widest mt-1 text-[#8C7A58]">
              Maison Aurelia Atelier
            </span>
          </div>
        )}

        {/* Quiet text label (max 1 subtle tag, never badge spam) */}
        {product.limitedEdition && (
          <div className="absolute top-3 left-3 bg-[#141413]/85 text-[#FAF9F6] text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-xs font-sans">
            {product.limitedEdition}
          </div>
        )}

        {/* Quick View & Bag Floating Actions on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-[#FAF9F6]/95 text-[#141413] text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Examine</span>
          </button>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="py-2 px-3 bg-[#141413] text-[#FAF9F6] hover:bg-[#2C2926] text-[11px] tracking-[0.18em] uppercase font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            title="Add to Shopping Bag"
          >
            {isAddedRecently ? (
              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            )}
            <span className="hidden sm:inline">{isAddedRecently ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Card Metadata Details */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          {/* Unboxed Kicker */}
          <div className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase text-[#7A756D] mb-1">
            <span>{product.categoryLabel}</span>
            <span className="text-[#A39E96]">{product.sizes[0]}</span>
          </div>

          <h3 className="font-serif-luxury text-lg lg:text-xl text-[#141413] font-normal leading-snug group-hover:text-[#8C7A58] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-[#736F68] line-clamp-1 mt-0.5 font-sans">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom row: Swatches & Tabular Price */}
        <div className="pt-2 border-t border-[#E8E4DD] flex items-center justify-between">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer border ${
                  selectedColor.name === color.name
                    ? 'ring-1 ring-[#141413] scale-110 border-white'
                    : 'border-black/20 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>

          {/* Tabular Price */}
          <div className="text-right">
            <span className="font-sans text-[15px] font-semibold text-[#141413] tabular-nums tracking-tight">
              ${product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
