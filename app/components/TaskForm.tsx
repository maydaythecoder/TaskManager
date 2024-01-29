"use client";

import { db } from "./firebase"; // Add storage import
import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  BellIcon,
  ExclamationTriangleIcon,
  BellSnoozeIcon,
  BellSlashIcon,
  BellAlertIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

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
import {Task} from "../../lib/types/task.types"

const Tasks: Task[] = [];
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}


export default function TaskForm() {

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    color: "",
    level: "",
  });
  const [selected, setSelected] = useState(color[4]);
  const [TasksList, setTasksList] = useState<Task[]>(Tasks);
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  useEffect(() => {
    setNewTask((prev) => ({ ...prev, level: getCurrentTime() }));
  }, []);
  const addTask = async (e: { target: any; preventDefault: () => void }) => {
    e.preventDefault();
    if (
      newTask.title !== "" &&
      newTask.description !== "" &&
      newTask.color !== "" &&
      newTask.level !== ""
    ) {
      await addDoc(collection(db, "Tasks"), {
        title: newTask.title.trim(),
        description: newTask.description,
        color: newTask.color,
        level: newTask.level,
      });

      setNewTask({ title: "", description: "", color: "", level: "" });
      setSelected(color[4]);

      const TasksSnapshot = await getDocs(collection(db, "Tasks"));
      const updatedTasksList = TasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as Task[];
      setTasksList(updatedTasksList);
      e.target.form.reset(); // Reset the entire form
    }
  };
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

  return (
    <div className="absolute">
    <div className="min-w-fit flex-1 pl-10">
      <form action="#" className="relative ml-10" autoComplete="off">
        <div className=" overflow-x-hidden overflow-y-visible rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600">
          {/* Task title input field */}
          <input
            type="text"
            name="Task"
            id="Task"
            className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6 mx-5 my-5 focus:text-white"
            placeholder="Task title"
            defaultValue={""}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          {/* Task description */}
          <input
            type="text"
            name="Description"
            id="Description"
            className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6 mx-5 my-5 focus:text-white"
            placeholder="Description"
            defaultValue={""}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />

          {/* Spacer element to match the height of the toolbar */}
          <div className="py-2" aria-hidden="true">
            {/* Matches height of the button in the toolbar (1px border + 36px content height) */}
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  setNewTask({ ...newTask, level: getCurrentTime() })
                }
                className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <ClockIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Select a time</span>
              </button>
            </div>

            <div className="flex items-center">
              {/* urgency level dropdown  */}
              <Listbox
                value={selected}
                onChange={(value) => {
                  setSelected(value);
                  setNewTask({ ...newTask, color: value.name });
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only">Urgency</Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                        <span className="flex items-center justify-center">
                          {selected && selected.value === null ? (
                            <span>
                              <ExclamationTriangleIcon
                                className="h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span className="sr-only">Select Urgency</span>
                            </span>
                          ) : (
                            <span>
                              <span
                                className={classNames(
                                  selected && selected.bgColor,
                                  "flex h-8 w-8 items-center justify-center rounded-full"
                                )}
                              >
                                {selected && (
                                  <selected.icon
                                    className="h-5 w-5 flex-shrink-0 text-white"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                              <span className="sr-only">
                                {selected && selected.name}
                              </span>
                            </span>
                          )}
                        </span>
                      </Listbox.Button>
                      {/* opening animation */}
                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                          {color.map((color) => (
                            <Listbox.Option
                              key={color.name}
                              className={({ active }) =>
                                classNames(
                                  active ? "bg-gray-100" : "bg-white",
                                  "relative cursor-default select-none px-3 py-2"
                                )
                              }
                              value={color}
                            >
                              <div className="flex items-center">
                                <div
                                  className={classNames(
                                    color.bgColor,
                                    "flex h-8 w-8 items-center justify-center rounded-full"
                                  )}
                                >
                                  <color.icon
                                    className={classNames(
                                      color.iconColor,
                                      "h-5 w-5 flex-shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                </div>
                                <span className="ml-3 block truncate font-medium">
                                  {color.name}
                                </span>
                              </div>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          </div>
          <div className="flex-shrink-0 mx-2">
            <button
              onClick={addTask}
              type="submit"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
};


