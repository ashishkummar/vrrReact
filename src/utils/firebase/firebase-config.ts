import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6XohVHBZ9vyojkpxjDalL2soKqhmhnWE",
  authDomain: "vttreact.firebaseapp.com",
  projectId: "vttreact",
  storageBucket: "vttreact.firebasestorage.app",
  messagingSenderId: "949179626111",
  appId: "1:949179626111:web:6342f4d56934f1d71c054a",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Define types for event data
interface EventData {
  [key: string]: any;
}

// ✅ Function to log events to Firestore with retry logic
export async function logEvent(eventName: string, eventData: EventData) {
  const MAX_RETRIES = 3;
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      await addDoc(collection(db, "extension_events"), {
        eventName,
        eventData,
        timestamp: serverTimestamp(), // Using Firestore's server timestamp
      });
      console.log(`✅ Event ${eventName} logged.`);
      return; // Exit after successful logging
    } catch (error) {
      attempts++;
      console.error(`❌ Attempt ${attempts} failed to log event ${eventName}:`, error);
      if (attempts >= MAX_RETRIES) {
        console.error("❌ Maximum retry attempts reached. Event logging failed.");
      }
    }
  }
}

  