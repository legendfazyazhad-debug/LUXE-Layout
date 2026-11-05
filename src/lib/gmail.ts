export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  isUnread: boolean;
  bodyPreview?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
}

/**
 * Robust Base64URL encoder that correctly handles UTF-8 (French accents, quotes, etc.)
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Demo fallback emails shown before signing in to Gmail
 */
export const DEMO_SALON_EMAILS: GmailMessageSummary[] = [
  {
    id: 'demo-msg-1',
    threadId: 'th-1',
    snippet: 'Madame Vance confirms your private fitting suite at 14 Place Vendôme. Vintage champagne service prepared.',
    subject: 'Confirmation de Suite Privée · Salon Place Vendôme',
    from: 'Madame Hélène Vance <concierge@luxelayout.com>',
    to: 'me',
    date: 'Today',
    isUnread: true,
  },
  {
    id: 'demo-msg-2',
    threadId: 'th-2',
    snippet: 'Your private invitation to the Autumn-Winter Défilé Haute Couture. Front-row salon credentials enclosed.',
    subject: 'Invitation Confidentielle · Défilé Haute Couture Série XII',
    from: 'Direction Artistique <atelier@luxelayout.paris>',
    to: 'me',
    date: 'Yesterday',
    isUnread: false,
  },
  {
    id: 'demo-msg-3',
    threadId: 'th-3',
    snippet: 'Certificate of Provenance for your double-faced Mongolian cashmere silhouette. Archival record registered.',
    subject: 'Certificat d’Authenticité & Passeport Savoir-Faire N° 8492',
    from: 'Atelier Archives <archives@luxelayout.com>',
    to: 'me',
    date: 'Nov 2',
    isUnread: false,
  },
];

/**
 * Fetch messages from Gmail API
 */
export async function fetchVipSalonEmails(
  accessToken: string,
  searchQuery: string = 'label:INBOX'
): Promise<GmailMessageSummary[]> {
  try {
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=${encodeURIComponent(
      searchQuery
    )}`;
    const listRes = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!listRes.ok) {
      const errJson = await listRes.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Gmail API error (${listRes.status})`);
    }

    const listData = await listRes.json();
    if (!listData.messages || listData.messages.length === 0) {
      return [];
    }

    // Fetch message headers for each
    const detailed = await Promise.all(
      listData.messages.map(async (item: { id: string; threadId: string }) => {
        try {
          const msgUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`;
          const msgRes = await fetch(msgUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!msgRes.ok) return null;
          const msgData = await msgRes.json();

          const headers: Record<string, string> = {};
          msgData.payload?.headers?.forEach((h: { name: string; value: string }) => {
            headers[h.name.toLowerCase()] = h.value;
          });

          return {
            id: msgData.id,
            threadId: msgData.threadId,
            snippet: msgData.snippet || '',
            subject: headers['subject'] || '(No Subject)',
            from: headers['from'] || 'Unknown Sender',
            to: headers['to'] || 'me',
            date: headers['date'] ? new Date(headers['date']).toLocaleDateString() : 'Recent',
            isUnread: msgData.labelIds?.includes('UNREAD') ?? false,
          } as GmailMessageSummary;
        } catch {
          return null;
        }
      })
    );

    return detailed.filter((m): m is GmailMessageSummary => m !== null);
  } catch (error) {
    console.error('Error fetching VIP Salon emails:', error);
    throw error;
  }
}

/**
 * Send an email using Gmail API (Requires explicit user confirmation before calling!)
 */
export async function sendGmailMessage(
  accessToken: string,
  payload: SendEmailPayload
): Promise<{ id: string; threadId: string }> {
  const boundary = '===_NextPart_' + Math.random().toString(36).substring(2);

  const rawLines = [
    `To: ${payload.to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    payload.bodyText,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    payload.bodyHtml || `<div>${payload.bodyText.replace(/\n/g, '<br/>')}</div>`,
    '',
    `--${boundary}--`,
  ];

  const rawMessage = rawLines.join('\r\n');
  const encodedRaw = base64UrlEncode(rawMessage);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedRaw }),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Failed to send email (${res.status})`);
  }

  return await res.json();
}
