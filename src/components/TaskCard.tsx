"use client";

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

  return (
    <>
      <div className="p-6 border border-gray-700 rounded-lg shadow-lg w-80 bg-gray-900">
        <h3 className="text-xl font-bold mb-3 text-yellow-300">{task.title}</h3>
        <textarea readOnly className="w-full bg-gray-900 resize-none focus:outline-none border-none" name="" value={task.description} id=""></textarea>
        <p className="text-gray-400 text-xs mb-4">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
        <div className="flex justify-between">
          <button
            onClick={() => onUpdate(task._id, task.isCompleted)}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition rounded"
          >
            {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
