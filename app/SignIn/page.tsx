"use client"

import { FormEvent, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { authInstance, db } from "../components/firebase";
import { useRouter } from "next/navigation";
import { UserData } from "@/lib/types/user.types";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";

// Define the component
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Use authInstance if available, otherwise create a new auth instance
  const auth = authInstance ? authInstance : getAuth();

  // Function to add user data to Firestore
  const addUser = async (uid: string, data: Partial<UserData>) => {
    try {
      const userRef = doc(collection(db, "users"), uid);

      // Check if user with the same email already exists
      const existingUser = await getDoc(userRef);
      if (existingUser.exists()) {
        console.log("User with the same email already exists");
        router.push("/TaskList");
        return;
      }

      // If user doesn't exist, add user data to Firestore
      await setDoc(userRef, data, { merge: true });
      console.log("User document successfully created/updated");

      // Navigate to TaskList upon successful user creation
      router.push("/TaskList");
    } catch (error: any) {
      console.error("Error adding user document:", error.message);
      throw new Error("Failed to add user document to Firestore");
    }
  };

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Successful login
      const user = result.user;
      const uid = user.uid;

      // Creating a dictionary with user properties
      const userDetails = {
        uid: user.uid,
        displayName: user.displayName || '',
        title: '',
        photoURL: user.photoURL || '',
        email: user.email || '',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || '',
        isAnonymous: user.isAnonymous,
        tenantId: user.tenantId || '',
        providerId: user.providerId,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        providerData: user.providerData.map((provider) => ({
          providerId: provider.providerId,
          uid: provider.uid,
          displayName: provider.displayName || '',
          email: provider.email || '',
          phoneNumber: provider.phoneNumber || '',
          photoURL: provider.photoURL || '',
        })),
      };

      // Add user data to Firestore
      await addUser(uid, userDetails);

      // Navigate to TaskList upon successful Google login
      router.push("/TaskList");
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle regular sign-in
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Assuming a successful login, you can navigate to the TaskList component
      if (result) {
        router.push("/TaskList");
      }
    } catch (error) {
      console.error(error);
      // Handle other error scenarios here
    }
  };

  // Function to handle sign-up
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      var user = userCredential.user;
      const uid = user.uid;

      // Define user data to be stored in Firestore
      const userData: Partial<UserData> = {
        email: user.email || '',
        // Add more properties as needed
      };

      // Creating a dictionary with user properties
      var userDetails = {
        uid: user.uid,
        displayName: user.displayName || '',
        title: '',
        photoURL: user.photoURL || '',
        email: user.email || '',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || '',
        isAnonymous: user.isAnonymous,
        tenantId: user.tenantId || '',
        providerId: user.providerId,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        providerData: user.providerData.map((provider) => ({
          providerId: provider.providerId,
          uid: provider.uid,
          displayName: provider.displayName || '',
          email: provider.email || '',
          phoneNumber: provider.phoneNumber || '',
          photoURL: provider.photoURL || '',
        })),
      };

      // Add user data to Firestore
      await addUser(uid, userDetails);

      // Navigate to TaskList upon successful signup
      router.push("/UserInfo");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      console.error('Sign-up error:', errorCode, errorMessage);
    }

    setEmail('');
    setPassword('');
  };

  // Render the component
  return (
    <>
      <div className="">
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <form
                className="space-y-6"
                action="#"
                method="POST"
                onSubmit={(e) => { handleSignIn(e); handleSignUp(e); }}  
                // {/* Corrected onSubmit handler */}
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm leading-6 text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div>
                <div className="relative mt-10">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={signInWithGoogle}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fillRule="nonzero"
                      fill="#ffffff"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      viewBox="0,0,48,48"
                      width="48px"
                      height="48px"
                    >
                      <path d="M43.611,20.083h-1.611v-0.083h-18v8h11.303c-1.649,4.657 -6.08,8 -11.303,8c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c3.059,0 5.842,1.154 7.961,3.039l5.657,-5.657c-3.572,-3.329 -8.35,-5.382 -13.618,-5.382c-11.045,0 -20,8.955 -20,20c0,11.045 8.955,20 20,20c11.045,0 20,-8.955 20,-20c0,-1.341 -0.138,-2.65 -0.389,-3.917z"></path>
                      <path d="M6.306,14.691l6.571,4.819c1.778,-4.402 6.084,-7.51 11.123,-7.51c3.059,0 5.842,1.154 7.961,3.039l5.657,-5.657c-3.572,-3.329 -8.35,-5.382 -13.618,-5.382c-7.682,0 -14.344,4.337 -17.694,10.691z"></path>
                      <path d="M24,44c5.166,0 9.86,-1.977 13.409,-5.192l-6.19,-5.238c-2.008,1.521 -4.504,2.43 -7.219,2.43c-5.202,0 -9.619,-3.317 -11.283,-7.946l-6.522,5.025c3.31,6.477 10.032,10.921 17.805,10.921z"></path>
                      <path d="M43.611,20.083l-0.016,-0.083h-1.595h-18v8h11.303c-0.792,2.237 -2.231,4.166 -4.087,5.571c0.001,-0.001 0.002,-0.001 0.003,-0.002l6.19,5.238c-0.438,0.398 6.591,-4.807 6.591,-14.807c0,-1.341 -0.138,-2.65 -0.389,-3.917z"></path>
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Gmail
                    </span>
                  </button>

                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Hotmail
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-gray-400">
              Not a member?{" "}
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
              >
                Start a 14 day free trial
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
