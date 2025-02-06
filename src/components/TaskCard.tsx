"use client";

import { useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

const TaskCard = ({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (_id: string, isCompleted: boolean) => void;
  onDelete: (_id: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [showFullTask, setShowFullTask] = useState(false);

  // const toggleCompletion = async (_id: string, isCompleted: boolean) => {
  //   setLoading(true);
  //   await fetch(`/api/tasks/${email}`, {
  //     method: "PUT",
  //     body: JSON.stringify({ id: task._id, isCompleted: !task.isCompleted }),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   setLoading(false);
  //   onUpdate(_id, isCompleted);
  // };

  return (
    <>
      <div className="p-4 cursor-pointer border rounded-lg shadow-md w-80 h-40 bg-gray-700">
        <h3 className="text-xl font-bold">{task.title}</h3>
        <p className="truncate">{task.description}</p>
        <p className="text-gray-500 text-sm">
          Due: {new Date(task.dueDate).toDateString()}
        </p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => onUpdate(task._id, task.isCompleted)}
            className="px-3 py-1 text-white bg-blue-600 rounded"
          >
            {loading
              ? "Updating..."
              : task.isCompleted
              ? "Mark Incomplete"
              : "Mark Complete"}
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="px-3 py-1 text-white bg-red-600 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
