import React, { useEffect, useState } from "react";
import { authInstance, db } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { authInstance, storageInstance } from "./firebase";
// import { ref, getDownloadURL } from "firebase/storage";

export default function ProfilePicture() {
    const [profilePic, setprofilePic] = useState();


    useEffect(() => {
        const currentUser = authInstance.currentUser;
        if (currentUser) {
          getDoc(doc(collection(db, "users"), currentUser.uid))
            .then((docSnapshot) => {
              const userData = docSnapshot.data();
              setprofilePic(userData?.photoURL);

            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
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
