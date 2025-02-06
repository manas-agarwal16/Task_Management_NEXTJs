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
      <div className="p-4 border rounded-lg shadow-md w-80 h-52 bg-gray-800">
        <h3 className="text-xl font-semibold mb-3 italic text-yellow-200">
          {task.title}
        </h3>
        <textarea readOnly className="w-full bg-gray-800 resize-none focus:outline-none border-none" name="" value={task.description} id=""></textarea>
        <p className="text-gray-500 text-sm">
          Due: {new Date(task.dueDate).toDateString()}
        </p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => onUpdate(task._id, task.isCompleted)}
            className="px-3 py-1 text-white bg-blue-600 rounded"
          >
            {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
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
