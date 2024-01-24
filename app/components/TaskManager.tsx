"use client";

import React from "react";
// import { authInstance, db, storageInstance } from "./firebase"; // Add storage import
// import { Listbox, Transition } from "@headlessui/react";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   onSnapshot,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import {
//   BellIcon,
//   ExclamationTriangleIcon,
//   BellSnoozeIcon,
//   BellSlashIcon,
//   BellAlertIcon,
//   ClockIcon,
//   XMarkIcon,
// } from "@heroicons/react/20/solid";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { ref, getDownloadURL } from "firebase/storage"; // Add storage imports
import ProfilePicture from "./ProfilePicture";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

// const color = [
//   {
//     name: "red",
//     icon: BellAlertIcon,
//     iconColor: "text-white",
//     bgColor: "bg-red-500",
//   },
//   {
//     name: "yellow",
//     icon: BellIcon,
//     iconColor: "text-white",
//     bgColor: "bg-yellow-400",
//   },
//   {
//     name: "green",
//     icon: BellSnoozeIcon,
//     iconColor: "text-white",
//     bgColor: "bg-green-400",
//   },
//   {
//     name: "blue",
//     icon: BellSlashIcon,
//     iconColor: "text-white",
//     bgColor: "bg-blue-500",
//   },
//   {
//     name: "nothing",
//     value: null,
//     icon: XMarkIcon,
//     iconColor: "text-gray-400",
//     bgColor: "bg-transparent",
//   },
// ];
// const Tasks: Task[] = [];
// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ");
// }
// interface Task {
//   id: number;
//   title: string;
//   level: string;
//   description: string;
//   color?: string; // Make color optional
// }
export default function TaskManager() {
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // const [profileURL, setprofileURL] = useState<string>("");
  // const user = authInstance.currentUser;
  // const profilePic = authInstance.currentUser?.photoURL;
  // const [newTask, setNewTask] = useState({
  //   title: "",
  //   description: "",
  //   color: "",
  //   level: "",
  // });
  // const [selected, setSelected] = useState(color[4]);
  // const [TasksList, setTasksList] = useState<Task[]>(Tasks);
  // const getCurrentTime = () => {
  //   const now = new Date();
  //   const hours = now.getHours().toString().padStart(2, "0");
  //   const minutes = now.getMinutes().toString().padStart(2, "0");
  //   return `${hours}:${minutes}`;
  // };
  // useEffect(() => {
  //   setNewTask((prev) => ({ ...prev, level: getCurrentTime() }));
  // }, []);
  // const addTask = async (e: { target: any; preventDefault: () => void }) => {
  //   e.preventDefault();
  //   if (
  //     newTask.title !== "" &&
  //     newTask.description !== "" &&
  //     newTask.color !== "" &&
  //     newTask.level !== ""
  //   ) {
  //     await addDoc(collection(db, "Tasks"), {
  //       title: newTask.title.trim(),
  //       description: newTask.description,
  //       color: newTask.color,
  //       level: newTask.level,
  //     });

  //     setNewTask({ title: "", description: "", color: "", level: "" });
  //     setSelected(color[4]);

  //     const TasksSnapshot = await getDocs(collection(db, "Tasks"));
  //     const updatedTasksList = TasksSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     })) as unknown as Task[];
  //     setTasksList(updatedTasksList);
  //     e.target.form.reset(); // Reset the entire form
  //   }
  // };
  // useEffect(() => {
  //   const q = query(collection(db, "Tasks"));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     let TasksArr: Task[] = []; // Change the type to Task[]
  //     querySnapshot.forEach((doc) => {
  //       TasksArr.push({ ...doc.data(), id: doc.id } as unknown as Task); // Type cast to Task
  //     });
  //     setTasksList(TasksArr);
  //   });
  //   return () => unsubscribe();
  // }, []);
  // //delete items from database
  // const deleteTask = async (id: number) => {
  //   await deleteDoc(doc(db, "Tasks", id.toString())); // Convert id to string if needed
  // };
  // const getColorClasses = (color: string) => {
  //   switch (color) {
  //     case "red":
  //       return "text-red-700 ring-1 ring-inset ring-red-600/20";
  //     case "blue":
  //       return "text-blue-700 ring-1 ring-inset ring-blue-600/20";
  //     case "green":
  //       return "text-green-700 ring-1 ring-inset ring-green-600/20";
  //     case "yellow":
  //       return "text-yellow-700 ring-1 ring-inset ring-yellow-600/20";
  //     default:
  //       return "";
  //   }
  // };

  // useEffect(() => {
  //   // Assuming 'uploadedFile' is updated when a file is uploaded
  //   // Fetch file details from Firebase Storage and update 'profileURL'
  //   if (uploadedFile && user?.uid) {
  //     const uploadedFileRef = ref(storageInstance, `cover-photos/${user.uid}/${uploadedFile.name}`);

  //     getDownloadURL(uploadedFileRef)
  //       .then((downloadURL: string) => setprofileURL(profilePic))
  //       .catch((error: any) => console.error("Error fetching file URL:", error));
  //   }
  // }, [uploadedFile, user]);











  // useEffect(() => {
  //   if (uploadedFile && user?.uid) {
  //       const extension = uploadedFile.name.split('.').pop(); // Extract the file extension
  
  //       // Construct the filename with "profilePic.png" or the extracted extension
  //       const filename = `profilePic.${extension}`; // Construct the specific filename
  //     const uploadedFileRef = ref(
  //       storageInstance,
  //       `cover-photos/${user.uid}/${filename}`
  //     ); // Use the constructed filename

  //     getDownloadURL(uploadedFileRef)
  //       .then((downloadURL: string) => {
  //         if (downloadURL) {
  //           setprofileURL(downloadURL); // Use downloadURL from Firebase Storage
  //         } else if (profilePic) {
  //           setprofileURL(profilePic as string); // Fallback to profilePic if downloadURL is undefined
  //         }
  //       })
  //       .catch((error: any) =>
  //         console.error("Error fetching file URL:", error)
  //       );
  //   }
  // }, [uploadedFile, user]);

  // // ...

  // console.log(user);
  // console.log(user?.photoURL);
  // console.log(profileURL)
  return (
    <div>
      {/* form to add Tasks */}
      <div className="Tasks-start  my-10 mx-10 lg:col-start-2 lg:row-end-1 w-fit mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
        <ProfilePicture />
        <TaskForm />
      </div>
      {/* display list of Tasks */}
        <TaskList />
    </div>
  );
}
