import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, User, ShieldCheck } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, setDoc, doc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { ConciergeMessage, Product } from '../types';
import LUXE_LOGO from '../assets/images/luxelayout_logo_hallmark_1793865614391.jpg';

interface ConciergeChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  referencedProduct?: Product | null;
  onOpenSalonModal: () => void;
}

const INITIAL_MESSAGES: ConciergeMessage[] = [
  {
    id: 'msg-init-1',
    userId: 'default',
    sender: 'stylist',
    stylistName: 'Madame Hélène Vance',
    stylistRole: 'Directrice des Salons Haute Couture',
    text: 'Bonjour and welcome to Luxe Layout. I am Hélène Vance, salon director at 14 Place Vendôme. How may I assist your wardrobe curation today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    isRead: true,
  },
];

export const ConciergeChatDrawer: React.FC<ConciergeChatDrawerProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  referencedProduct,
  onOpenSalonModal,
}) => {
  const [messages, setMessages] = useState<ConciergeMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If a referenced product is provided on open, add a greeting prompt if not already present
  useEffect(() => {
    if (referencedProduct && isOpen) {
      const productPrompt: ConciergeMessage = {
        id: `msg-product-${referencedProduct.id}`,
        userId,
        sender: 'system',
        stylistName: 'Maison Concierge Desk',
        stylistRole: 'Automated Reference',
        text: `Inquiring about creation: "${referencedProduct.name}" (${referencedProduct.categoryLabel} · $${referencedProduct.price.toLocaleString()})`,
        referencedProduct: referencedProduct.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };

      setMessages((prev) => {
        if (!prev.some((m) => m.id === productPrompt.id)) {
          return [...prev, productPrompt];
        }
        return prev;
      });
    }
  }, [referencedProduct, isOpen, userId]);

  // Firestore real-time listener if authenticated user exists
  useEffect(() => {
    if (!auth.currentUser || auth.currentUser.uid !== userId) return;

    const messagesCol = collection(db, 'users', userId, 'conciergeMessages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((docSnap) => docSnap.data() as ConciergeMessage);
          setMessages(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${userId}/conciergeMessages`);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ConciergeMessage = {
      id: `msg-patron-${Date.now()}`,
      userId: userId || 'patron-guest',
      sender: 'member',
      stylistName: userName || 'Patron',
      stylistRole: 'Client',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Save to Firestore if user is authenticated
    try {
      if (auth.currentUser && auth.currentUser.uid === userId) {
        const msgDocRef = doc(db, 'users', userId, 'conciergeMessages', userMsg.id);
        await setDoc(msgDocRef, userMsg);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${userId}/conciergeMessages`);
    }

    // Generate intelligent haute couture stylist response
    setTimeout(async () => {
      let stylistReply =
        'An impeccable inquiry. Our atelier cuts each piece with sculptural precision. Would you like me to prepare a bespoke garment swatch coffret or reserve an exclusive salon fitting at Place Vendôme?';

      const lower = text.toLowerCase();
      if (lower.includes('size') || lower.includes('sizing') || lower.includes('fit')) {
        stylistReply =
          'Our tailoring runs true to classic French couture proportion. For outerwear, the silhouette allows for relaxed layering over cashmere knitwear. We also offer made-to-measure bespoke adjustments in our private fitting suites.';
      } else if (lower.includes('cashmere') || lower.includes('coat')) {
        stylistReply =
          'Le Manteau Cachemire is woven from 100% traceable Mongolian fibres (650g/m²). It is double-faced and finished by hand with zero external visible machine stitching. An enduring centerpiece for any winter wardrobe.';
      } else if (lower.includes('bag') || lower.includes('handbag') || lower.includes('leather')) {
        stylistReply =
          'Our Box Calfskin is tanned in Annonay using traditional vegetal immersion. It develops a rich, luminous patina over decades. Each piece is hand-burnished and stamped with a serialized hallmark.';
      } else if (lower.includes('dress') || lower.includes('gown') || lower.includes('evening')) {
        stylistReply =
          'The evening column gowns are hand-pleated in four-ply silk crepe de chine. They feature an internal silk grosgrain waist stay to drape weightlessly against the body for black-tie galas.';
      } else if (lower.includes('salon') || lower.includes('visit') || lower.includes('appointment')) {
        stylistReply =
          'It would be our distinct pleasure to receive you. You can reserve your dedicated salon suite right now using the button below.';
      }

      const stylistMsg: ConciergeMessage = {
        id: `msg-stylist-${Date.now()}`,
        userId: userId || 'patron-guest',
        sender: 'stylist',
        stylistName: 'Madame Hélène Vance',
        stylistRole: 'Directrice des Salons Haute Couture',
        text: stylistReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };

      setMessages((prev) => [...prev, stylistMsg]);
      setIsTyping(false);

      try {
        if (auth.currentUser && auth.currentUser.uid === userId) {
          const msgDocRef = doc(db, 'users', userId, 'conciergeMessages', stylistMsg.id);
          await setDoc(msgDocRef, stylistMsg);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `users/${userId}/conciergeMessages`);
      }
    }, 1200);
  };

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
        <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center justify-between bg-[#F7F4EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs overflow-hidden border border-[#D4AF37]/60 shadow-xs shrink-0 bg-[#141413]">
              <img
                src={LUXE_LOGO}
                alt="Luxe Layout Hallmark"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif-luxury text-base font-semibold text-[#141413]">
                  Madame Hélène Vance
                </h3>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <p className="text-[10px] tracking-widest uppercase text-[#736F68] font-sans">
                Place Vendôme Private Stylist Desk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#736F68] hover:text-[#141413] transition-colors cursor-pointer"
            aria-label="Close concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div
                  key={msg.id}
                  className="p-2.5 bg-[#FAF3E0] border border-[#D4AF37]/30 text-center text-[11px] text-[#8C7A58] rounded-xs"
                >
                  <span className="font-medium">{msg.text}</span>
                </div>
              );
            }

            const isMe = msg.sender === 'member';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 text-[10px] text-[#7A756D]">
                  <span>{isMe ? 'You' : msg.stylistName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-xs max-w-[85%] leading-relaxed ${
                    isMe
                      ? 'bg-[#141413] text-[#FAF9F6]'
                      : 'bg-[#F2EFE9] text-[#141413] border border-[#E8E4DD]'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-[11px] text-[#7A756D] italic">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8C7A58] animate-bounce" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8C7A58] animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8C7A58] animate-bounce [animation-delay:0.4s]" />
              <span>Madame Vance is drafting guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-6 py-2 border-t border-[#E8E4DD] bg-[#FAF9F6] flex gap-2 overflow-x-auto text-[10px] text-[#736F68]">
          <button
            onClick={() => handleSendMessage('What are the measurements and sizing advice?')}
            className="px-2.5 py-1.5 bg-[#F2EFE9] hover:bg-[#E8E4DD] border border-[#E8E4DD] rounded-xs whitespace-nowrap cursor-pointer transition-colors"
          >
            Sizing consultation
          </button>
          <button
            onClick={() => handleSendMessage('How should I style this piece for an evening gala?')}
            className="px-2.5 py-1.5 bg-[#F2EFE9] hover:bg-[#E8E4DD] border border-[#E8E4DD] rounded-xs whitespace-nowrap cursor-pointer transition-colors"
          >
            Styling suggestions
          </button>
          <button
            onClick={onOpenSalonModal}
            className="px-2.5 py-1.5 bg-[#FAF3E0] text-[#8C7A58] border border-[#D4AF37]/40 hover:bg-[#F5E6BE] rounded-xs whitespace-nowrap cursor-pointer transition-colors font-medium"
          >
            Reserve fitting suite
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E8E4DD] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Madame Vance about fabrications, private fittings..."
              className="flex-1 text-xs p-3 bg-[#FAF9F6] border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-[#141413] text-white hover:bg-[#2C2926] disabled:opacity-40 transition-colors cursor-pointer rounded-xs"
              title="Send communication"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[9px] text-[#7A756D]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#8C7A58]" />
              Private Confidential Patron Thread
            </span>
            <span>Paris 8e Central Salon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
