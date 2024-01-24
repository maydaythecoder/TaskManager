"use client";
import React from "react";
import ProfilePicture from "./ProfilePicture";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function TaskManager() {
  return (
    <div>
      <div className="Tasks-start  my-10 mx-10 lg:col-start-2 lg:row-end-1 w-fit mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
        <ProfilePicture />
        <TaskForm />
      </div>
      <TaskList />
    </div>
  );
}
