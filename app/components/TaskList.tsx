"use client";

import { db } from "./firebase"; // Add storage import
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  BellIcon,
  BellSnoozeIcon,
  BellSlashIcon,
  BellAlertIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {Task} from "../../lib/types/task.types"

const color = [
  {
    name: "red",
    icon: BellAlertIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "yellow",
    icon: BellIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "green",
    icon: BellSnoozeIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "blue",
    icon: BellSlashIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "nothing",
    value: null,
    icon: XMarkIcon,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];
const Tasks: Task[] = [];

export default function TaskList() {
  const [TasksList, setTasksList] = useState<Task[]>(Tasks);
  useEffect(() => {
    const q = query(collection(db, "Tasks"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let TasksArr: Task[] = []; // Change the type to Task[]
      querySnapshot.forEach((doc) => {
        TasksArr.push({ ...doc.data(), id: doc.id } as unknown as Task); // Type cast to Task
      });
      setTasksList(TasksArr);
    });
    return () => unsubscribe();
  }, []);
  //delete items from database
  const deleteTask = async (id: number) => {
    await deleteDoc(doc(db, "Tasks", id.toString())); // Convert id to string if needed
  };
  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return "text-red-700 ring-1 ring-inset ring-red-600/20";
      case "blue":
        return "text-blue-700 ring-1 ring-inset ring-blue-600/20";
      case "green":
        return "text-green-700 ring-1 ring-inset ring-green-600/20";
      case "yellow":
        return "text-yellow-700 ring-1 ring-inset ring-yellow-600/20";
      default:
        return "";
    }
  };
  return (
    <div className="lg:col-start-3 lg:row-end-1 w-fit mx-10 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-96">
      {TasksList.map((Task) => (
        <div
          key={Task.id}
          className={`rounded-lg bg-gray-50 shadow-sm ${
            Task.color && getColorClasses(Task.color)
          }`}
        >
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6">
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                {Task.title}
              </dd>
            </div>
            <div className="flex-none self-end px-6 pt-4">
              <dd
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  Task.color && getColorClasses(Task.color)
                }`}
              >
                {Task.level}
              </dd>
            </div>
          </dl>
          <div className="mt-6 border-t border-gray-900/5 px-6 pb-6">
            <h2 className="text-gray-600">{Task.description}</h2>
            <div className="flex-none self-end px-6 pt-4">
              <button
                onClick={() => deleteTask(Task.id)}
                type="submit"
                className="inline-flex items-center rounded-md font-medium bg-red-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 absolute ml-80 mb-5 -mt-5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
