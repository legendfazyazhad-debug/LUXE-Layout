import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { initAuth, googleSignIn } from './lib/auth-workspace';
import { CategoryType, CartItem, Product, OrderRecord, UserVIPProfile, SalonBooking } from './types';
import { LUXURY_PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ClientSpaceModal } from './components/ClientSpaceModal';
import { PrivateSalonModal } from './components/PrivateSalonModal';
import { ConciergeChatDrawer } from './components/ConciergeChatDrawer';
import { VipSalonGmailModal } from './components/VipSalonGmailModal';
import { AtelierSection } from './components/AtelierSection';
import { Footer } from './components/Footer';
import { SlidersHorizontal, Sparkles, Mail } from 'lucide-react';

export default function App() {
  // Navigation & Category Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isClientSpaceOpen, setIsClientSpaceOpen] = useState(false);
  const [isSalonModalOpen, setIsSalonModalOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isVipGmailOpen, setIsVipGmailOpen] = useState(false);
  const [gmailTemplate, setGmailTemplate] = useState<{ subject: string; body: string } | undefined>(
    undefined
  );
  const [salonInitialLocation, setSalonInitialLocation] = useState<string | undefined>(undefined);

  // Selected product for quick view & concierge reference
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [conciergeProduct, setConciergeProduct] = useState<Product | null>(null);

  // Cart State (with local storage restoration)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('luxelayout_cart');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        product: LUXURY_PRODUCTS[0],
        quantity: 1,
        selectedSize: LUXURY_PRODUCTS[0].sizes[0],
        selectedColor: LUXURY_PRODUCTS[0].colors[0],
      },
    ];
  });

  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [giftNote, setGiftNote] = useState('');

  // Authentication & VIP Profile
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vipProfile, setVipProfile] = useState<UserVIPProfile>({
    uid: 'patron-vip-vance',
    email: 'client.vance@luxelayout.com',
    displayName: 'Eleanor Vance',
    clientTier: 'Couture Elite',
    completedSpend: 24750,
    preferredSalon: 'Paris Place Vendôme',
    phone: '+1 (212) 849-5500',
    createdAt: new Date().toISOString(),
  });

  // Client Orders (with Firestore sync)
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Persist cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('luxelayout_cart', JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);

  // Auth listener using Workspace initAuth
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, _token) => {
        if (user) {
          setCurrentUser(user);
          setVipProfile((prev) => ({
            ...prev,
            uid: user.uid,
            email: user.email || prev.email,
            displayName: user.displayName || prev.displayName,
          }));

          // Fetch real orders from Firestore
          try {
            const ordersCol = collection(db, 'orders');
            const q = query(ordersCol, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              const fetchedOrders = snapshot.docs.map((docSnap) => docSnap.data() as OrderRecord);
              setOrders(fetchedOrders);
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, 'orders');
          }
        }
      },
      () => {
        setCurrentUser(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (e) {
      console.warn('Google sign-in status:', e);
    }
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    color: { name: string; hex: string }
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedSize: size,
          selectedColor: color,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCart((prev) => {
        const next = [...prev];
        next[index].quantity = newQty;
        return next;
      });
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckout = (giftWrap: boolean, note: string) => {
    setIncludeGiftWrap(giftWrap);
    setGiftNote(note);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setVipProfile((prev) => ({
      ...prev,
      completedSpend: prev.completedSpend + order.totalAmount,
    }));
  };

  const handleOpenSalonModal = (location?: string) => {
    setSalonInitialLocation(location);
    setIsSalonModalOpen(true);
  };

  const handleOpenConciergeWithProduct = (product: Product) => {
    setConciergeProduct(product);
    setQuickViewProduct(null);
    setIsConciergeOpen(true);
  };

  const handleOpenVipGmailWithTemplate = (template?: { subject: string; body: string }) => {
    setGmailTemplate(template);
    setIsVipGmailOpen(true);
  };

  // Filtered and sorted products
  const filteredProducts = LUXURY_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // featured order
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#141413]">
      {/* 3-Zone Luxury Header */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenClientSpace={() => setIsClientSpaceOpen(true)}
        onOpenSalonModal={() => handleOpenSalonModal()}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenVipGmail={() => handleOpenVipGmailWithTemplate()}
        onGoogleSignIn={handleGoogleSignIn}
        userTier={vipProfile.clientTier}
        isLoggedIn={Boolean(currentUser)}
        userDisplayName={currentUser?.displayName || vipProfile.displayName}
        userPhotoUrl={currentUser?.photoURL}
      />

      {/* Main Campaign Hero */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('creations');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookSalonClick={() => handleOpenSalonModal()}
      />

      {/* Main Catalog & Curated Wardrobe Section */}
      <main id="creations" className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 flex-1 w-full space-y-12">
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E4DD] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[#7A756D]">
              <span>Prêt-à-Porter & Haute Couture</span>
              <span aria-hidden="true">·</span>
              <span>Série N° XII</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#141413] font-light tracking-tight">
              Curated Wardrobe Creations
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-[#736F68]">
              Showing {filteredProducts.length} Exemplars
            </span>
          </div>
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#F2EFE9] rounded-xs border border-[#E8E4DD] overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All Creations' },
                { id: 'outerwear', label: 'Outerwear & Tailoring' },
                { id: 'leather-goods', label: 'Leather Goods' },
                { id: 'evening-dresses', label: 'Evening & Silk' },
                { id: 'horlogerie-jewelry', label: 'Horlogerie & Jewelry' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#141413] text-[#FAF9F6] shadow-xs'
                    : 'text-[#5C5750] hover:text-[#141413] hover:bg-white/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cashmere, silk, bags..."
                className="text-xs p-2.5 pl-3 pr-8 bg-white border border-[#E8E4DD] rounded-xs focus:border-[#141413] focus:outline-none w-48 sm:w-60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#A39E96] hover:text-[#141413] text-xs cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs bg-white border border-[#E8E4DD] px-3 py-2 rounded-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7A58]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3-Column Luxury Product Grid with 100% Unique Product Photos */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#F7F4EE] border border-[#E8E4DD] rounded-xs">
            <p className="font-serif-luxury text-2xl text-[#141413]">
              No creation matched your criteria
            </p>
            <p className="text-xs text-[#736F68] max-w-sm mx-auto">
              Our Paris concierge desk can source or hand-tailor custom bespoke pieces upon request.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-6 py-2 bg-[#141413] text-white text-xs uppercase tracking-widest cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* VIP Salon Dual Features: Stylist Desk + Gmail Dispatch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stylist Concierge Feature */}
          <div className="p-8 bg-[#FAF3E0] border border-[#D4AF37]/50 rounded-xs flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#8C7A58] font-medium">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Haute Couture Wardrobe Curation</span>
              </div>
              <h3 className="font-serif-luxury text-2xl lg:text-3xl text-[#141413]">
                Direct Salon Stylist Desk
              </h3>
              <p className="text-xs text-[#5C5750] leading-relaxed">
                Connect in real-time with Madame Hélène Vance at 14 Place Vendôme for private event
                silhouette curation and custom tailoring inquiries.
              </p>
            </div>

            <button
              onClick={() => setIsConciergeOpen(true)}
              className="w-full py-3.5 bg-[#141413] text-[#FAF9F6] text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] transition-colors rounded-xs cursor-pointer shadow-xs"
            >
              Consult Salon Director
            </button>
          </div>

          {/* VIP Salon Gmail Feature */}
          <div className="p-8 bg-[#F4F1EA] border border-[#E8E4DD] rounded-xs flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#8C7A58] font-medium">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Official Salon Communications</span>
              </div>
              <h3 className="font-serif-luxury text-2xl lg:text-3xl text-[#141413]">
                VIP Salon Gmail Dispatch
              </h3>
              <p className="text-xs text-[#5C5750] leading-relaxed">
                Send bespoke commission requests, private fitting confirmations, and gala RSVPs
                directly from your authorized Google Gmail account.
              </p>
            </div>

            <button
              onClick={() => handleOpenVipGmailWithTemplate()}
              className="w-full py-3.5 border border-[#141413] text-[#141413] text-xs uppercase tracking-widest font-medium hover:bg-[#141413] hover:text-[#FAF9F6] transition-colors rounded-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Open VIP Salon Gmail</span>
            </button>
          </div>
        </div>
      </main>

      {/* Atelier Craftsmanship & Heritage Section */}
      <AtelierSection
        onOpenSalonModal={() => handleOpenSalonModal()}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Footer */}
      <Footer
        onOpenSalonModal={handleOpenSalonModal}
        onOpenClientSpace={() => setIsClientSpaceOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenConciergeWithProduct={handleOpenConciergeWithProduct}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        includeGiftWrap={includeGiftWrap}
        giftNote={giftNote}
        userId={vipProfile.uid}
        userEmail={vipProfile.email}
        userName={vipProfile.displayName}
        onOrderSuccess={handleOrderSuccess}
      />

      <ClientSpaceModal
        isOpen={isClientSpaceOpen}
        onClose={() => setIsClientSpaceOpen(false)}
        currentUser={currentUser}
        vipProfile={vipProfile}
        orders={orders}
        onOpenSalonModal={() => {
          setIsClientSpaceOpen(false);
          handleOpenSalonModal();
        }}
        onOpenConcierge={() => {
          setIsClientSpaceOpen(false);
          setIsConciergeOpen(true);
        }}
        onOpenVipGmail={() => {
          setIsClientSpaceOpen(false);
          handleOpenVipGmailWithTemplate();
        }}
      />

      <PrivateSalonModal
        isOpen={isSalonModalOpen}
        onClose={() => setIsSalonModalOpen(false)}
        initialLocation={salonInitialLocation}
        onBookConfirmed={(booking: SalonBooking) => {
          console.info('Salon booking confirmed:', booking);
        }}
        onOpenGmailDispatchWithTemplate={(template) => {
          handleOpenVipGmailWithTemplate(template);
        }}
      />

      <ConciergeChatDrawer
        isOpen={isConciergeOpen}
        onClose={() => {
          setIsConciergeOpen(false);
          setConciergeProduct(null);
        }}
        userId={vipProfile.uid}
        userName={vipProfile.displayName}
        referencedProduct={conciergeProduct}
        onOpenSalonModal={() => {
          setIsConciergeOpen(false);
          handleOpenSalonModal();
        }}
      />

      <VipSalonGmailModal
        isOpen={isVipGmailOpen}
        onClose={() => {
          setIsVipGmailOpen(false);
          setGmailTemplate(undefined);
        }}
        currentUser={currentUser}
        userTier={vipProfile.clientTier}
        initialTemplate={gmailTemplate}
      />
    </div>
  );
}
