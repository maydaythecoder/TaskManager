"use client";
import { FormEvent, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { authInstance, storageInstance } from "../components/firebase";
import { db } from "../components/firebase";
import { doc, collection, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [agreed, setAgreed] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string | null>(null); // Added state for photoURL
  const router = useRouter();

  const handleFileChange = async (event: { target: { files: any; }; }) => {
    const files = event.target.files;
  
    if (files.length > 0) {
      const user = getAuth().currentUser;
  
      if (user) {
        const uploadedFile = files[0];
        const extension = uploadedFile.name.split('.').pop(); // Extract the file extension
  
        // Construct the filename with "profilePic.png" or the extracted extension
        const filename = `profilePic.${extension}`;
  
        const storageRef = ref(storageInstance, `cover-photos/${user.uid}/${filename}`); // Use the new filename
  
        try {
          const uploadPhoto = uploadBytes(storageRef, uploadedFile);
  
          await uploadPhoto.then(async () => {
            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
        
            // Fetch the user document to update
            const userDocRef = doc(db, 'users', user.uid);
        
            // Update the photoURL field with the downloadURL
            await updateDoc(userDocRef, { photoURL: downloadURL });
        
            console.log("Photo URL successfully updated in Firestore!");
          });
        
        } catch (error) {
          console.error('Error uploading file:', error);
        }
        
      } else {
        console.error('User is null. Please make sure the user is authenticated.');
      }
    }
  };
  
  
  

  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser) {
      getDoc(doc(collection(db, "users"), currentUser.uid))
        .then((docSnapshot) => {
          const userData = docSnapshot.data();
          setName(userData?.displayName || "");
          setNumber(userData?.phoneNumber || "");
          setPhotoURL(userData?.downloadURL ||"")
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [authInstance.currentUser]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentUser = authInstance.currentUser;
    if (currentUser) {
      try {
        const displayName = name.trim() !== "" ? name : "Username";
        const phoneNumber = number.trim() !== "" ? number : "PhoneNumber";

        const userRef = doc(collection(db, "users"), currentUser.uid);
        const data = {
          displayName,
          phoneNumber,
        };

        await setDoc(userRef, data, { merge: true });

        // Redirect to /Tasklist on successful submit
        router.push("/TaskList");
      } catch (error) {
        console.error("Error updating user information:", error);
        // Handle error gracefully
      }
    }

    // Reset form after submission
    setName("");
    setNumber("");
    setAgreed(false); // Assuming you want to reset the switch as well
  };

  //select the document where documentID matches UID
  // select the feilds in that doc labeled displayName, phoneNumber, and photoURL
  // set them to a user controled imput in the form below
  //onsubmit if the user selected an input set all values to what the user selected
  // else if the user didnt select an input set it to a generic name or photo, make the number and name required

  console.log(authInstance.currentUser?.photoURL)

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Complete Sign Up
        </h2>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
        onSubmit={handleSubmit}
      >
        <div className="sm:col-span-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Display name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first-name"
                id="first-name"
                onChange={handleNameChange} // Add onChange handler
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phone number
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option>US</option>
                  <option>CA</option>
                  <option>EU</option>
                </select>
              </div>
              <input
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
                onChange={handleNumberChange} // Add onChange handler
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Cover photo
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <PhotoIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".png, .jpg, .jpeg, .gif" // Specify accepted file types
                      size={10485760}  // Set maximum file size to 10MB
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className={classNames(
                  agreed ? "bg-indigo-600" : "bg-gray-200",
                  "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                )}
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    agreed ? "translate-x-3.5" : "translate-x-0",
                    "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                  )}
                />
              </Switch>
            </div>
            <Switch.Label className="text-sm leading-6 text-gray-600">
              By selecting this, you agree to our{" "}
              <a href="#" className="font-semibold text-indigo-600">
                privacy&nbsp;policy
              </a>
              .
            </Switch.Label>
          </Switch.Group>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Complete SignUp
          </button>
        </div>
      </form>
    </div>
  );
}
