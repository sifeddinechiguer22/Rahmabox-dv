import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAfgBqF4vjCNKO4kaebPTbE8tAwVP30wY8",
  authDomain: "rahmabox-64382.firebaseapp.com",
  projectId: "rahmabox-64382",
  storageBucket: "rahmabox-64382.firebasestorage.app",
  messagingSenderId: "120702963415",
  appId: "1:120702963415:web:aeeb8a1d1dcfe727ee2a92",
  measurementId: "G-41JPYH2HG9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const response = await fetch('http://127.0.0.1:8000/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name:  user.displayName || 'Utilisateur Google',
      email: user.email,
      phone: user.phoneNumber || '',
    }),
  });

  if (!response.ok) throw new Error('Erreur serveur Google auth');
  const payload = await response.json();

  return {
    fullName: payload.data.name,
    email:    payload.data.email,
    phone:    payload.data.phone || '',
    city:     payload.data.city  || '',
    role:     payload.data.role  || 'donateur',
    token:    payload.token,
  };
}

export async function getGoogleRedirectResult() { return null; }
