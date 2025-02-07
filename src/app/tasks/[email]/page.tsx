"use client";

import { useEffect, useState, use , useCallback } from "react";
import { TaskCard, Loading, Input } from "@/components";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

interface TaskFormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  description: HTMLTextAreaElement;
  dueDate: HTMLInputElement;
}

interface TaskFormElement extends HTMLFormElement {
  readonly elements: TaskFormElements;
}

export default function TaskPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  let { email } = use(params);
  email = decodeURIComponent(email);

  const [taskForm, setTaskForm] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  {/* Fetching tasks from the server */}
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks/${email}`);
    if (!res.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await res.json();
    setTasks(data.tasks);
    setLoading(false);
  }, [email]);

  {/* Updating task status : Complete / Incomplete */}
  const updateTaskStatus = async (_id: string, isCompleted: boolean) => {
    setLoading(true);
    await fetch(`/api/tasks/${email}`, {
      method: "PATCH",
      body: JSON.stringify({ _id, isCompleted }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
  };

  {/* Updating task details */}
  const updateTaskDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const form = event.currentTarget as TaskFormElement;
    const { title, description, dueDate }  = form.elements;
    const formData = {
      _id: editTaskId,
      title: title?.value,
      description: description?.value,
      dueDate: dueDate?.value,
    };

    await fetch(`/api/tasks/${email}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    setEditTask(false);
    setEditTaskId("");
    fetchTasks();
  };

  {/* Deleting a task */}
  const deleteTask = async (_id: string) => {
    setLoading(true);
    await fetch(`/api/tasks/${email}`, {
      method: "DELETE",
      body: JSON.stringify({ _id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
  };

  {/* Creating a task */}
  const createTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget as TaskFormElement;

    const { title, description, dueDate } = form.elements;

    // Form data
    const formData = {
      title: title.value,
      description: description.value,
      dueDate: dueDate.value,
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${email}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to upload task`);
      }

      setTaskForm(false);
      fetchTasks();
    } catch (error) {
      console.error("Error:", error);
      throw new Error(`Failed to create task`);
    }
  };

  useEffect(() => {
    fetchTasks();
  },[fetchTasks]);

  return (
    <>
      {loading && <Loading />}
      <main className={`min-h-screen border border-black relative`}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center my-8 bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text drop-shadow-lg">
          Task Management
        </h1>

        <div className="flex flex-col">
          {/* Create A Task Button */}
          <button
            onClick={() => setTaskForm(true)}
            className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-4 py-2 w-52 border border-transparent rounded-lg m-2 self-center md:self-end md:mr-24 lg:mr-52"
          >
            Create Task +
          </button>

          {/* Edit Task Form */}
          {editTask && (
            <>
              <div
                className={`fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-0`}
              ></div>
              <form
                onSubmit={(event) => updateTaskDetails(event)}
                className="absolute z-10 px-6 py-8 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-96 mx-auto top-72 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative mb-6">
                  <span
                    className="absolute text-gray-500 hover:text-gray-400 cursor-pointer top-0 right-0 text-2xl"
                    onClick={() => setTaskForm(false)}
                  >
                    &times;
                  </span>
                  <label
                    htmlFor="title"
                    className="block text-base font-semibold text-gray-100 mb-1"
                  >
                    Title
                  </label>
                  <Input
                    type="text"
                    id="title"
                    maxLength={25}
                    className="mt-1 px-4 py-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-base font-semibold text-gray-100 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="mt-1 px-4 py-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter task description"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="dueDate"
                    className="block text-base font-semibold text-gray-100 mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    id="dueDate"
                    className="mt-1 px-4 py-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Edit Task
                </button>
              </form>
            </>
          )}

          {/* Task Creation Form */}
          {taskForm && (
            <>
              <div
                className={`fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-0`}
              ></div>

              <form
                onSubmit={(event) => createTask(event)}
                className="absolute z-10 px-6 py-8 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-96 mx-auto top-72 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative mb-6">
                  <span
                    className="absolute text-gray-500 hover:text-gray-400 cursor-pointer top-0 right-0 text-2xl"
                    onClick={() => setTaskForm(false)}
                  >
                    &times;
                  </span>
                  <label
                    htmlFor="title"
                    className="block text-base font-semibold text-gray-100 mb-1"
                  >
                    Title
                  </label>
                  <Input
                    type="text"
                    id="title"
                    maxLength={25}
                    className="mt-1 px-4 py-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-base font-semibold text-gray-100 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="mt-1 px-4 py-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter task description"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="dueDate"
                    className="block text-base font-semibold text-gray-100 mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    id="dueDate"
                    className="mt-1 px-4 py-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Create Task
                </button>
              </form>
            </>
          )}

          {/* Message if user haven't added any task yet */}
          {tasks.length === 0 && !loading && (
            <div className="flex items-center justify-center h-96">
              <h1 className="text-2xl text-gray-400">
                Add a task to get started
              </h1>
            </div>
          )}

          {/* Listing User Tasks */}
          <ul
            className={`${
              loading ? "opacity-5" : ""
            } flex flex-wrap justify-center p-4 w-full`}
          >
            {tasks.map((task) => {
              return (
                <li className="relative m-3" key={task._id}>
                  <button
                    onClick={() => {
                      setEditTask(true);
                      setEditTaskId(task._id);
                    }}
                    className="absolute underline right-2 top-2 ml-2 text-gray-400 hover:text-gray-500"
                  >
                    Edit
                  </button>
                  <TaskCard
                    task={task}
                    onDeleteTask={deleteTask}
                    onUpdateTaskStatus={updateTaskStatus}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
}
