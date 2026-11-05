import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, Sparkles, Mail } from 'lucide-react';
import { SALON_LOCATIONS } from '../data/products';
import { SalonBooking } from '../types';

interface PrivateSalonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookConfirmed: (booking: SalonBooking) => void;
  initialLocation?: string;
  onOpenGmailDispatchWithTemplate?: (template: { subject: string; body: string }) => void;
}

export const PrivateSalonModal: React.FC<PrivateSalonModalProps> = ({
  isOpen,
  onClose,
  onBookConfirmed,
  initialLocation,
  onOpenGmailDispatchWithTemplate,
}) => {
  if (!isOpen) return null;

  const [location, setLocation] = useState(initialLocation || SALON_LOCATIONS[0].city);
  const [date, setDate] = useState('2026-11-18');
  const [timeSlot, setTimeSlot] = useState('14:30');
  const [consultationType, setConsultationType] = useState<
    'Haute Couture Fitting' | 'Bespoke Tailoring' | 'Private Jewelry Presentation' | 'Personal Styling'
  >('Haute Couture Fitting');
  const [guestCount, setGuestCount] = useState(2);
  const [name, setName] = useState('Eleanor Vance');
  const [email, setEmail] = useState('client.vance@luxelayout.com');
  const [phone, setPhone] = useState('+1 (212) 849-5500');
  const [specialRequests, setSpecialRequests] = useState(
    'Private champagne tasting and preview of the Autumn-Winter silk column gowns.'
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState<SalonBooking | null>(null);

  const selectedSalon = SALON_LOCATIONS.find((s) => s.city === location) || SALON_LOCATIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: SalonBooking = {
      id: `SB-${Math.floor(1000 + Math.random() * 9000)}`,
      salonLocation: location,
      date,
      timeSlot,
      consultationType,
      guestCount,
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      specialRequests,
    };
    setLastBooking(newBooking);
    setIsSuccess(true);
    onBookConfirmed(newBooking);
  };

  const handleSendGmailVoucher = () => {
    if (!lastBooking) return;
    const template = {
      subject: `Salon Fitting Confirmation Voucher · ${lastBooking.salonLocation} (${lastBooking.date})`,
      body: `Chère Madame Vance,\n\nThis is to confirm my scheduled private fitting appointment at ${lastBooking.salonLocation} on ${new Date(
        lastBooking.date
      ).toLocaleDateString()} at ${lastBooking.timeSlot}.\n\nConsultation Type: ${
        lastBooking.consultationType
      } (${lastBooking.guestCount} Guests)\nReference ID: ${lastBooking.id}\nSpecial Notes: ${
        lastBooking.specialRequests
      }\n\nWe look forward to enjoying vintage champagne tasting and exploring the Autumn-Winter collections.\n\nWarmest regards,\n${
        lastBooking.clientName
      }`,
    };
    onClose();
    if (onOpenGmailDispatchWithTemplate) {
      onOpenGmailDispatchWithTemplate(template);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#141413]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#FAF9F6] border border-[#E8E4DD] shadow-2xl rounded-xs overflow-hidden my-6"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E4DD] flex items-center justify-between bg-[#F7F4EE]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] bg-[#FAF3E0]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-2xl text-[#141413] tracking-wide">
                Private Salon Reservation
              </h2>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#7A756D]">
                Place Vendôme · Ginza 6 · Mayfair · Madison Ave
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#736F68] hover:text-[#141413] transition-colors cursor-pointer"
            aria-label="Close salon reservation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3E0] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <CheckCircle className="w-8 h-8 stroke-1" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C7A58] font-medium">
                Private Suite Confirmed
              </span>
              <h3 className="font-serif-luxury text-3xl text-[#141413]">
                Your Salon Fitting is Scheduled
              </h3>
              <p className="text-xs text-[#736F68] max-w-md mx-auto">
                Madame Vance and our Master Tailors look forward to welcoming you at{' '}
                <strong>{selectedSalon.city}</strong> on{' '}
                <strong>{new Date(date).toLocaleDateString()}</strong> at{' '}
                <strong>{timeSlot}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#F5EFEB] border border-[#E8E4DD] max-w-md mx-auto text-left text-xs space-y-1.5 font-sans">
              <p>
                <strong>Salon Address:</strong> {selectedSalon.address}
              </p>
              <p>
                <strong>Salon Director:</strong> {selectedSalon.director}
              </p>
              <p>
                <strong>Consultation:</strong> {consultationType} ({guestCount} Guests)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendGmailVoucher}
                className="px-6 py-3 bg-[#141413] text-[#FAF9F6] text-xs uppercase tracking-widest hover:bg-[#2C2926] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Transmit Voucher to Gmail</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-[#141413] text-[#141413] text-xs tracking-widest uppercase hover:bg-white cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 text-xs font-sans">
            {/* Salon Selection */}
            <div className="space-y-3">
              <label className="text-[11px] tracking-[0.18em] uppercase text-[#4A4742] font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8C7A58]" />
                <span>Select Flagship Atelier Salon</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SALON_LOCATIONS.map((s) => (
                  <button
                    key={s.city}
                    type="button"
                    onClick={() => setLocation(s.city)}
                    className={`p-3.5 text-left border rounded-xs transition-all cursor-pointer ${
                      location === s.city
                        ? 'border-[#141413] bg-[#EFECE6] text-[#141413] ring-1 ring-[#141413]'
                        : 'border-[#E8E4DD] text-[#5C5750] bg-white hover:border-[#B5AEA4]'
                    }`}
                  >
                    <p className="font-serif-luxury text-base text-[#141413] font-medium">
                      {s.city}
                    </p>
                    <p className="text-[11px] text-[#736F68] mt-0.5 truncate">{s.address}</p>
                    <p className="text-[10px] text-[#8C7A58] mt-1 font-sans">
                      Dir. {s.director}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#736F68] block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8C7A58]" />
                  <span>Fitting Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#736F68] block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8C7A58]" />
                  <span>Time Preference</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                >
                  <option value="11:00">11:00 AM · Morning Salon Session</option>
                  <option value="14:30">02:30 PM · Afternoon Fitting</option>
                  <option value="17:00">05:00 PM · Champagne Twilight Suite</option>
                  <option value="19:00">07:00 PM · Private After-Hours Appointment</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#736F68] block mb-1">
                  Guest Count
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                >
                  <option value={1}>1 Patron (Private Sole Fitting)</option>
                  <option value={2}>2 Patrons (Fitting & Companion)</option>
                  <option value={3}>3 Patrons (Private Bridal/Group Suite)</option>
                  <option value={4}>4 Patrons (Full Salon Buyout)</option>
                </select>
              </div>
            </div>

            {/* Consultation Style */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-wider uppercase text-[#736F68] block">
                Appointment Focus
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    'Haute Couture Fitting',
                    'Bespoke Tailoring',
                    'Private Jewelry Presentation',
                    'Personal Styling',
                  ] as const
                ).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setConsultationType(type)}
                    className={`py-2 px-2 text-center border text-[11px] rounded-xs cursor-pointer transition-colors ${
                      consultationType === type
                        ? 'border-[#141413] bg-[#141413] text-white font-medium'
                        : 'border-[#E8E4DD] bg-white text-[#5C5750] hover:border-[#141413]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Patron Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#736F68] block mb-1">
                  Patron Name
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
                <label className="text-[10px] tracking-wider uppercase text-[#736F68] block mb-1">
                  Email
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
                <label className="text-[10px] tracking-wider uppercase text-[#736F68] block mb-1">
                  Private Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="text-[10px] tracking-wider uppercase text-[#736F68] block mb-1">
                Curated Silhouette Requests or Specific Pieces
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Mention sizes, specific runway pieces, or private champagne hospitality notes..."
                className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none text-xs"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E8E4DD] flex items-center justify-between">
              <span className="text-[11px] text-[#7A756D]">
                Complimentary for Luxe Layout patrons · Transmit confirmation to your Gmail
              </span>
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#141413] text-[#FAF9F6] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#2C2926] transition-colors rounded-xs shadow-sm cursor-pointer"
              >
                Confirm Salon Reservation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
