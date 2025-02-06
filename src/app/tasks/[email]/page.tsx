"use client";

import { useEffect, useState, use } from "react";
import { TaskCard, Loading, Input } from "@/components";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

export default function TaskPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  let { email } = use(params);
  email = decodeURIComponent(email);

  const [taskForm, setTaskForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks/${email}`);
    const data = await res.json();
    console.log("fetched tasks : ", data);

    setTasks(data.tasks);
    setLoading(false);
  };

  const updateTask = async (_id: string, isCompleted: boolean) => {
    setLoading(true);
    await fetch(`/api/tasks/${email}`, {
      method: "PUT",
      body: JSON.stringify({ _id, isCompleted }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
  };

  const deleteTask = async (_id: string) => {
    setLoading(true);
    await fetch(`/api/tasks/${email}`, {
      method: "DELETE",
      body: JSON.stringify({ _id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
  };

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();

    // Form data
    const formData = {
      title: (event.target as any).title.value,
      description: (event.target as any).description.value,
      dueDate: (event.target as any).dueDate.value,
      email,
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

      const data = await res.json();
      console.log("Task created:", data);

      (event.target as any).reset();
      setTaskForm(false);
      fetchTasks();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log("fetching tasks from useEffect");
    fetchTasks();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <main className={`min-h-screen border border-black relative`}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center my-8 bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text drop-shadow-lg">
          Task Management
        </h1>

        <div className="flex flex-col">
          <button
            onClick={() => setTaskForm(true)}
            className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-4 py-2 w-52 border border-transparent rounded-lg m-2 self-center md:self-end md:mr-24 lg:mr-52"
          >
            Create Task +
          </button>

          {taskForm && (
            <>
              {/* Background blur */}
              <div
                className={`fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-0`}
              ></div>

              {/* Form centered */}
              <form
                onSubmit={(event) => handleCreateTask(event)}
                className="absolute z-10 px-4 py-6 bg-gray-900 rounded-lg shadow-lg w-96 mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="mb-4">
                  <span
                    className="absolute text-gray-400 hover:text-gray-500 cursor-pointer top-2 right-2"
                    onClick={() => setTaskForm(false)}
                  >
                    &times;
                  </span>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Title
                  </label>
                  <Input
                    type="text"
                    id="title"
                    maxLength={25}
                    className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-lg bg-gray-800 text-gray-200"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-lg bg-gray-800 text-gray-300 resize-none"
                    rows={4}
                    placeholder="Enter task description"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    id="dueDate"
                    className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-lg bg-gray-800 text-gray-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </form>
            </>
          )}
          {tasks.length === 0 && !loading && 
          <div className="flex items-center justify-center h-96">
            <h1 className="text-2xl text-gray-400">Add a task to get started</h1>
          </div>}
          <ul
            className={`${
              loading ? "opacity-5" : ""
            } flex flex-wrap justify-center p-4 w-full`}
          >
            {tasks.map((task) => {
              return (
                <li className="m-3" key={task._id}>
                  {" "}
                  <TaskCard
                    task={task}
                    onDelete={deleteTask}
                    onUpdate={updateTask}
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
