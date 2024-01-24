import React, { useEffect, useState } from "react";
import { authInstance, db, storageInstance } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";


export default function ProfilePicture() {
    const [profilePic, setprofilePic] = useState<string | undefined>("");



    useEffect(() => {
        // Check who's logged in
        const currentUser = authInstance.currentUser;
      
        if (currentUser) {
            const fetchFromStorage = async () => {
                const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif"];
                let downloadURL;
        
                for (const extension of allowedExtensions) {
                  const storageRef = ref(
                    storageInstance,
                    `cover-photos/${currentUser.uid}/profilePic${extension}`
                  );
                  try {
                    downloadURL = await getDownloadURL(storageRef);
                    break; // Exit the loop if a valid downloadURL is found
                  } catch (error: any) {
                    if (error.code !== "storage/object-not-found") {
                      // Handle other errors
                      console.error("Error fetching download URL:", error);
                    }
                  }
                }
        
                if (downloadURL) {
                  setprofilePic(downloadURL);
                } else {
                  console.log("Profile picture not found in Storage with any of the allowed extensions.");
                  // Handle the case where the file is not found
                }
              };
              
      
          const fetchFromFirestore = async () => {
            const docRef = doc(collection(db, "users"), currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setprofilePic(userData?.photoURL);
            }
          };
      
          // Choose the preferred method
          const method = "storage"; // or "firestore"
      
          if (method === "storage") {
            fetchFromStorage();
          } else {
            fetchFromFirestore();
          }
        }
      }, [authInstance.currentUser]); 

 console.log(profilePic)
console.log(authInstance.currentUser?.photoURL)
 return (
    <div className="absolute w-52 h-52">
      <img
        className="rounded-full bg-gray-50 overflow-hidden w-16 h-16"
        src={profilePic}
        alt="Picture of the author"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
