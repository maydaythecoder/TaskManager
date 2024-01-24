import React from "react";
import { authInstance } from "./firebase";
// import React, { useEffect, useState } from "react";
// import { authInstance, storageInstance } from "./firebase";
// import { ref, getDownloadURL } from "firebase/storage";

export default function ProfilePicture() {


    console.log(authInstance.currentUser?.photoURL)
    // select the photoURL feild from the document whos name matches the users uid
    /*---------------------------------------------------------------------------------------*/

    // store it in a variable 
    /*---------------------------------------------------------------------------------------*/
    // const profilePic = authInstance.currentUser?.photoURL
    // const profilePic (referance the location int the db)

    // render that variable
    /*---------------------------------------------------------------------------------------*/
    // src={profilePic}

    return (
    <div className="absolute w-52 h-52">
      <img
        className="rounded-full bg-gray-50 overflow-hidden w-16 h-16"
        src="https://firebasestorage.googleapis.com/v0/b/task-manager-c7b75.appspot.com/o/cover-photos%2F2bSgVN19mYaI4ry7Vd47sWYo6L52%2FprofilePic.jpg?alt=media&token=91866149-b0bf-403a-b1c6-f2869af7c32f"
        alt="Picture of the author"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
