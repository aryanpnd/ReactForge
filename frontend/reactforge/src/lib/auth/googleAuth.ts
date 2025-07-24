import { User } from '@/store/authStore';
import { apiClient } from '@/lib/config/apiConfig';
import axios from 'axios';

const GOOGLE_CLIENT_ID = "1037655663343-j288fouvkjleq7ncr9sgdvf6qn7tr37u.apps.googleusercontent.com";

// Decode JWT token from Google
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Send Google auth data to backend
const sendGoogleAuthToBackend = async (userInfo: any) => {
  try {
    const response = await apiClient.post('/api/auth/google', {
      googleId: userInfo.sub,
      email: userInfo.email,
      firstName: userInfo.given_name || '',
      lastName: userInfo.family_name || '',
      avatar: userInfo.picture,
    });

    return response.data;
  } catch (error) {
    console.error('Backend Google auth error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Google authentication failed');
    }
    throw error;
  }
};

// Initialize Google Sign-In
export const initGoogleAuth = (onSuccess: (user: User) => void, onError: (error: string) => void) => {
  const handleCredentialResponse = async (response: any) => {
    try {
      const userInfo = decodeJWT(response.credential);

      if (!userInfo) {
        throw new Error('Failed to decode Google credentials');
      }

      // Send to backend for verification and session creation
      const backendResponse = await sendGoogleAuthToBackend(userInfo);

      // Create user object from backend response
      const user: User = {
        id: backendResponse.id || userInfo.sub,
        email: userInfo.email,
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
        avatar: userInfo.picture,
        provider: 'google'
      };

      onSuccess(user);
    } catch (error) {
      console.error('Google sign-in error:', error);
      onError(error instanceof Error ? error.message : 'Google sign-in failed');
    }
  };

  google.accounts.id.prompt()

  if (window.google?.accounts?.id) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the standard Google Sign-In button
    const googleButtonContainer = document.getElementById("google-signin-btn");
    if (googleButtonContainer) {
      window.google.accounts.id.renderButton(
        googleButtonContainer,
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: 350
        }
      );
    }
  } else {
    onError('Google Sign-In not available');
  }
};

declare global {
  interface Window {
    google: any;
  }
}