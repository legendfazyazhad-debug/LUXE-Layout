import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
];

// Standard provider for general client sign-in (fast, reliable, minimum privilege)
export const standardGoogleProvider = new GoogleAuthProvider();
standardGoogleProvider.setCustomParameters({ prompt: 'select_account' });

// Gmail-enabled provider for Salon Gmail dispatch
export const gmailGoogleProvider = new GoogleAuthProvider();
gmailGoogleProvider.setCustomParameters({ prompt: 'select_account' });
GMAIL_SCOPES.forEach((scope) => gmailGoogleProvider.addScope(scope));

// In-memory token cache (NEVER stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export interface SignInResult {
  user: User;
  accessToken: string | null;
}

export function getReadableAuthError(error: any): string {
  if (!error) return 'An unknown authentication error occurred.';
  const code = error.code || '';
  const message = error.message || '';

  if (code === 'auth/popup-blocked') {
    return 'The Google sign-in window was blocked by your browser. Please allow popups for this site, or open this preview in a new window tab.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'The sign-in window was closed before completing authentication.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'A previous sign-in window is still open or was cancelled.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This domain is awaiting authorization in Firebase Console (Authentication > Settings > Authorized domains).';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google provider is not enabled in Firebase Console (Authentication > Sign-in method > Google).';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network request failed. Please check your internet connection.';
  }

  return message || 'Authentication failed. Please verify popup permissions and try again.';
}

export const googleSignIn = async (
  requireGmailScopes: boolean = false
): Promise<SignInResult | null> => {
  try {
    isSigningIn = true;
    const provider = requireGmailScopes ? gmailGoogleProvider : standardGoogleProvider;

    let result;
    try {
      result = await signInWithPopup(auth, provider);
    } catch (popupErr: any) {
      // If Gmail scopes failed due to restricted permissions or policy, fallback to standard sign-in
      if (
        requireGmailScopes &&
        (popupErr.code === 'auth/internal-error' ||
          popupErr.code === 'auth/invalid-credential' ||
          popupErr.code === 'auth/operation-not-allowed')
      ) {
        console.warn('Retrying with standard Google provider...');
        result = await signInWithPopup(auth, standardGoogleProvider);
      } else {
        throw popupErr;
      }
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
