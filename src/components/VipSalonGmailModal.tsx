import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  Sparkles,
  Inbox,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, getAccessToken } from '../lib/auth-workspace';
import { fetchVipSalonEmails, sendGmailMessage, GmailMessageSummary } from '../lib/gmail';
import LUXE_LOGO from '../assets/images/luxelayout_logo_hallmark_1793865614391.jpg';

interface VipSalonGmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  userTier?: string;
  initialTemplate?: {
    subject: string;
    body: string;
  };
}

export const VipSalonGmailModal: React.FC<VipSalonGmailModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userTier = 'Couture Elite',
  initialTemplate,
}) => {
  if (!isOpen) return null;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('compose');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Email fetching states
  const [emails, setEmails] = useState<GmailMessageSummary[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<GmailMessageSummary | null>(null);

  // Compose states
  const [recipient, setRecipient] = useState('concierge@luxelayout.com');
  const [subject, setSubject] = useState(
    initialTemplate?.subject || 'Private Salon Consultation & Atelier Fitting Request'
  );
  const [bodyText, setBodyText] = useState(
    initialTemplate?.body ||
      `Chère Madame Vance,\n\nI would like to request an exclusive private fitting appointment at the Place Vendôme flagship salon. I am especially interested in the Autumn-Winter Double-Faced Cashmere Coat and evening column silhouettes.\n\nPlease confirm availability for a private suite with vintage champagne tasting.\n\nWarm regards,\n${
        currentUser?.displayName || 'VIP Patron'
      }`
  );

  // Mandatory confirmation dialog state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  // Load in-memory token on mount
  useEffect(() => {
    getAccessToken().then((token) => {
      setAccessToken(token);
      if (token) {
        loadEmails(token);
      }
    });
  }, [isOpen]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        loadEmails(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Unable to authenticate with Google Gmail.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loadEmails = async (token: string) => {
    setIsLoadingEmails(true);
    try {
      const list = await fetchVipSalonEmails(token, 'label:INBOX');
      setEmails(list);
    } catch (err) {
      console.warn('Could not load Gmail inbox:', err);
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleApplyTemplate = (type: 'fitting' | 'bespoke' | 'gala') => {
    if (type === 'fitting') {
      setSubject('Private Atelier Fitting Suite Reservation · Place Vendôme');
      setBodyText(
        `Chère Madame Vance,\n\nI am writing to reserve a private fitting suite at 14 Place Vendôme for two guests. We would be delighted to inspect the Autumn-Winter outerwear and bespoke tailoring collection.\n\nKindly advise if a fitting suite is available next week.\n\nRespectfully,\n${
          currentUser?.displayName || 'Patron'
        }`
      );
    } else if (type === 'bespoke') {
      setSubject('Commission Inquiry · Bespoke Made-to-Measure Evening Gown');
      setBodyText(
        `Dear Luxe Layout Atelier,\n\nI would like to initiate a custom commission for a bespoke four-ply silk evening column gown for an upcoming gala. Please share the atelier availability for an initial silhouette drafting session.\n\nSincerely,\n${
          currentUser?.displayName || 'Patron'
        }`
      );
    } else if (type === 'gala') {
      setSubject('RSVP · Autumn-Winter Haute Couture Runway Presentation');
      setBodyText(
        `Madame Hélène Vance,\n\nIt is my absolute pleasure to confirm attendance for the private salon runway presentation. Please extend my compliments to the atelier team.\n\nWarmest regards,\n${
          currentUser?.displayName || 'Patron'
        }`
      );
    }
  };

  // Triggered when user clicks "Review & Send"
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !bodyText.trim()) return;
    // MANDATORY confirmation dialog before sending
    setShowConfirmModal(true);
  };

  // Called after explicit user confirmation in the dialog
  const handleConfirmAndSend = async () => {
    if (!accessToken) return;
    setIsSending(true);
    setShowConfirmModal(false);

    try {
      await sendGmailMessage(accessToken, {
        to: recipient,
        subject,
        bodyText,
        bodyHtml: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E8E4DD; background-color: #FAF9F6; color: #141413;">
            <div style="text-align: center; border-bottom: 1px solid #E8E4DD; padding-bottom: 16px; margin-bottom: 20px;">
              <h2 style="font-size: 20px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0; color: #141413;">Luxe Layout</h2>
              <p style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #D4AF37; margin: 4px 0 0 0;">Haute Couture · VIP Salon Communique</p>
            </div>
            <div style="font-size: 14px; line-height: 1.7; color: #2C2926; white-space: pre-wrap;">
              ${bodyText}
            </div>
            <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #E8E4DD; font-size: 11px; color: #7A756D; text-align: center;">
              Sent securely via Luxe Layout VIP Patron Suite · Place Vendôme, Paris
            </div>
          </div>
        `,
      });

      setSendSuccessMessage(`Dispatch successfully transmitted from your Gmail account to ${recipient}.`);
      setTimeout(() => setSendSuccessMessage(null), 6000);
      loadEmails(accessToken);
    } catch (err: any) {
      alert(`Could not send email: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
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
        className="relative w-full max-w-4xl bg-[#FAF9F6] border border-[#E8E4DD] shadow-2xl rounded-xs overflow-hidden max-h-[92vh] flex flex-col my-4"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E4DD] flex items-center justify-between bg-[#F7F4EE]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xs overflow-hidden border border-[#D4AF37]/60 shadow-xs shrink-0 bg-[#141413]">
              <img
                src={LUXE_LOGO}
                alt="Luxe Layout Logo Emblem"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-2xl text-[#141413] tracking-wide">
                  VIP Salon Gmail Dispatch
                </h2>
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 bg-[#FAF3E0] text-[#8C7A58] border border-[#D4AF37]/30 font-sans">
                  {userTier}
                </span>
              </div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#7A756D]">
                Official Atelier Communications & Confidential Mailbox
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#736F68] hover:text-[#141413] transition-colors cursor-pointer"
            aria-label="Close Gmail Dispatch"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Check: If no access token, show official Google Sign In button */}
        {!accessToken ? (
          <div className="p-10 text-center space-y-6 max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF3E0] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-6 h-6 stroke-1" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-luxury text-2xl text-[#141413]">
                Connect VIP Salon to Gmail
              </h3>
              <p className="text-xs text-[#736F68] leading-relaxed font-sans">
                Authorize direct, confidential communication between your personal Gmail account and
                the Place Vendôme Salon Directors to receive fitting confirmations, lookbook dispatches,
                and RSVP privileges.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Official Material Google Sign-In Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="gsi-material-button flex items-center gap-3 px-6 py-3 bg-white border border-[#747775] rounded-md shadow-xs hover:bg-[#F8FAFC] transition-colors cursor-pointer font-sans text-xs font-medium text-[#1F1F1F]"
              >
                <div className="w-4 h-4">
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
                <span>
                  {isAuthenticating ? 'Connecting to Gmail...' : 'Sign in with Google for VIP Salon'}
                </span>
              </button>
            </div>

            <p className="text-[10px] text-[#A8A39A]">
              We request Gmail permissions exclusively to read salon communications and send official
              fitting confirmations upon your explicit instruction.
            </p>
          </div>
        ) : (
          /* Authenticated Gmail View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab switch */}
            <div className="px-6 border-b border-[#E8E4DD] bg-[#FAF9F6] flex items-center justify-between">
              <div className="flex gap-6 text-[11px] tracking-[0.2em] uppercase font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('compose')}
                  className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'compose'
                      ? 'border-[#141413] text-[#141413]'
                      : 'border-transparent text-[#7A756D] hover:text-[#141413]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-[#8C7A58]" />
                  <span>Compose Dispatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('inbox');
                    if (accessToken) loadEmails(accessToken);
                  }}
                  className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'inbox'
                      ? 'border-[#141413] text-[#141413]'
                      : 'border-transparent text-[#7A756D] hover:text-[#141413]'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5 text-[#8C7A58]" />
                  <span>Confidential Inbox ({emails.length})</span>
                </button>
              </div>

              <div className="text-[11px] text-[#736F68] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Connected: {currentUser?.email}</span>
              </div>
            </div>

            {/* Success notification banner */}
            {sendSuccessMessage && (
              <div className="px-6 py-3 bg-[#FAF3E0] border-b border-[#D4AF37]/40 text-xs text-[#8C7A58] flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{sendSuccessMessage}</span>
              </div>
            )}

            {/* TAB: COMPOSE */}
            {activeTab === 'compose' && (
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 font-sans text-xs">
                {/* Pre-curated Templates */}
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-wider uppercase text-[#736F68] block">
                    Curated Salon Communique Templates
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate('fitting')}
                      className="px-3 py-1.5 bg-[#F2EFE9] border border-[#E8E4DD] hover:border-[#141413] rounded-xs text-[#4A4742] hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Private Fitting Suite Reservation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate('bespoke')}
                      className="px-3 py-1.5 bg-[#F2EFE9] border border-[#E8E4DD] hover:border-[#141413] rounded-xs text-[#4A4742] hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Bespoke Evening Commission
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate('gala')}
                      className="px-3 py-1.5 bg-[#F2EFE9] border border-[#E8E4DD] hover:border-[#141413] rounded-xs text-[#4A4742] hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Haute Couture Runway RSVP
                    </button>
                  </div>
                </div>

                <form onSubmit={handleInitiateSend} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#736F68] uppercase text-[10px] mb-1 font-medium">
                        Recipient (Salon Director / Atelier)
                      </label>
                      <input
                        type="email"
                        required
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#736F68] uppercase text-[10px] mb-1 font-medium">
                        Sender Gmail Account
                      </label>
                      <input
                        type="text"
                        disabled
                        value={currentUser?.email || 'Authenticated Patron'}
                        className="w-full p-2.5 bg-[#F5EFEB] border border-[#E8E4DD] text-[#736F68] cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#736F68] uppercase text-[10px] mb-1 font-medium">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#736F68] uppercase text-[10px] mb-1 font-medium">
                      Message Content
                    </label>
                    <textarea
                      rows={7}
                      required
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      className="w-full p-3 bg-white border border-[#E8E4DD] focus:border-[#141413] focus:outline-none font-serif-luxury text-sm leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E8E4DD]">
                    <div className="text-[11px] text-[#7A756D] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#8C7A58]" />
                      <span>Transmitted directly through the official Google Gmail API</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="px-8 py-3.5 bg-[#141413] text-[#FAF9F6] text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Review & Send Email</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: INBOX */}
            {activeTab === 'inbox' && (
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Email list */}
                <div className="w-full md:w-1/2 border-r border-[#E8E4DD] overflow-y-auto p-4 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DD]">
                    <span className="text-[10px] tracking-widest uppercase text-[#736F68]">
                      Recent Messages ({emails.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => accessToken && loadEmails(accessToken)}
                      disabled={isLoadingEmails}
                      className="text-xs text-[#8C7A58] hover:text-[#141413] flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingEmails ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {isLoadingEmails ? (
                    <div className="py-12 text-center text-xs text-[#736F68]">
                      Loading your Gmail messages...
                    </div>
                  ) : emails.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#736F68] space-y-1">
                      <p>No recent messages found.</p>
                      <p className="text-[11px] text-[#A8A39A]">
                        Use the "Compose Dispatch" tab to send your first communique.
                      </p>
                    </div>
                  ) : (
                    emails.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedEmail(msg)}
                        className={`p-3 border rounded-xs cursor-pointer transition-colors ${
                          selectedEmail?.id === msg.id
                            ? 'bg-[#EFECE6] border-[#141413]'
                            : 'bg-white border-[#E8E4DD] hover:border-[#B5AEA4]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#7A756D] mb-1">
                          <span className="font-medium text-[#141413] truncate max-w-[180px]">
                            {msg.from}
                          </span>
                          <span>{msg.date}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#141413] truncate mb-0.5">
                          {msg.subject}
                        </h4>
                        <p className="text-[11px] text-[#736F68] line-clamp-2">{msg.snippet}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Email reader preview */}
                <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-white flex flex-col justify-between">
                  {selectedEmail ? (
                    <div className="space-y-4">
                      <div className="border-b border-[#E8E4DD] pb-4 space-y-2">
                        <span className="text-[10px] tracking-widest uppercase text-[#8C7A58]">
                          Message Detail
                        </span>
                        <h3 className="font-serif-luxury text-xl text-[#141413] font-normal">
                          {selectedEmail.subject}
                        </h3>
                        <div className="text-xs text-[#736F68] space-y-0.5">
                          <p>
                            <strong>From:</strong> {selectedEmail.from}
                          </p>
                          <p>
                            <strong>To:</strong> {selectedEmail.to}
                          </p>
                          <p>
                            <strong>Date:</strong> {selectedEmail.date}
                          </p>
                        </div>
                      </div>

                      <div className="font-sans text-xs text-[#2C2926] leading-relaxed whitespace-pre-wrap py-2">
                        {selectedEmail.snippet}
                      </div>

                      <div className="pt-4 border-t border-[#E8E4DD]">
                        <button
                          type="button"
                          onClick={() => {
                            setRecipient(
                              selectedEmail.from.match(/<([^>]+)>/)?.[1] || selectedEmail.from
                            );
                            setSubject(`Re: ${selectedEmail.subject}`);
                            setBodyText(`\n\n--- In reply to ---\n${selectedEmail.snippet}`);
                            setActiveTab('compose');
                          }}
                          className="px-4 py-2 border border-[#141413] text-xs uppercase tracking-widest hover:bg-[#141413] hover:text-white transition-colors cursor-pointer"
                        >
                          Reply to Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-xs text-[#736F68] py-16 space-y-2">
                      <Mail className="w-8 h-8 stroke-1 text-[#8C7A58]" />
                      <p>Select a message to view the full communique.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANDATORY EXPLICIT USER CONFIRMATION MODAL BEFORE SENDING EMAIL */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FAF9F6] border border-[#141413] max-w-lg w-full p-6 shadow-2xl rounded-xs space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 border-b border-[#E8E4DD] pb-3">
                <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h4 className="font-serif-luxury text-xl text-[#141413]">
                    Confirm Email Dispatch via Gmail
                  </h4>
                  <p className="text-[10px] tracking-wider uppercase text-[#7A756D]">
                    Explicit Authorization Required
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#5C5750] leading-relaxed">
                You are about to transmit the following email message through your personal Google
                Gmail account (<strong>{currentUser?.email}</strong>):
              </p>

              <div className="p-3 bg-white border border-[#E8E4DD] text-xs space-y-1.5 font-sans">
                <p>
                  <strong>Recipient:</strong> {recipient}
                </p>
                <p>
                  <strong>Subject:</strong> {subject}
                </p>
                <div className="mt-2 pt-2 border-t border-[#E8E4DD] text-[11px] text-[#736F68] max-h-32 overflow-y-auto italic">
                  "{bodyText}"
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 border border-[#E8E4DD] text-xs uppercase tracking-wider text-[#5C5750] hover:text-[#141413] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndSend}
                  disabled={isSending}
                  className="px-6 py-2.5 bg-[#141413] text-[#FAF9F6] text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isSending ? 'Sending via Gmail...' : 'Confirm & Send Email'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
