import Input from "./Input";
import React from 'react';

const FormComponent = () => {
  return (
  <div className="relative z-10 px-4 py-6 bg-gray-900 rounded-lg shadow-lg w-96">
    <h2 className="text-2xl font-bold mb-6 text-center text-white">Upload Task</h2>
    <form>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-200">Title</label>
        <input
          type="text"
          id="title"
          className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-lg bg-gray-800 text-gray-200"
          placeholder="Enter task title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-200">Description</label>
        <textarea
          id="description"
          className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-lg bg-gray-800 text-gray-300"
          rows={4}
          placeholder="Enter task description"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-200">Due Date</label>
        <input
          type="date"
          id="dueDate"
          className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-lg bg-gray-800 text-gray-200"
        />
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
        Submit
      </button>
    </form>
    </div>
  );
};

export default FormComponent;
