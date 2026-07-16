import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel } from "firebase/ai";
import { initializeFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";

export const app = initializeApp(firebaseConfig);

// Initialize Firestore with robust long-polling to prevent Wi-Fi drops
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const auth = getAuth(app);

const ai = getAI(app);
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash-lite" });

async function run() {
  const prompt = "Write a story about a magic backpack.";
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);
}
run();

const provider = new GoogleAuthProvider();
// Forces Google to prompt for account selection on click
provider.setCustomParameters({ prompt: "select_account" });

// Authenticate with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Firebase auth error:", error);
    throw error;
  }
}

// Sign Out configuration matching App.tsx hooks
export async function signOutUser() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

export { onAuthStateChanged };
