import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { UserData } from "./types/user.types";
import { authInstance, db } from "../app/components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(authInstance);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const userRef = doc(db, `users/${user.uid}`);

      unsubscribe = onSnapshot(userRef, (doc) => {
        setUserData(doc.data() as UserData);
      });
    }

    return unsubscribe;
  }, [user]);

  return { user, userData };
}