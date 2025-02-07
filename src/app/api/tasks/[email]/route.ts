import { NextResponse } from "next/server";
import connectDB from "../../../../lib/connectDB";
import Task from "../../../../model/task.model";

// GET: Fetch Tasks
export async function GET(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  await connectDB();
  try {
    const resolvedParams = await params;
    const { email } = resolvedParams;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const tasks = await Task.find({ email });
    return NextResponse.json({ success: true, tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST: Create Task
export async function POST(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  let { email } = resolvedParams;
  email = email.toLowerCase();

  try {
    const { title, description, dueDate } = await req.json();

    if (!title || !description || !dueDate || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, Description and Due Date are required",
        },
        { status: 400 }
      );
    }

    const taskAlreadyExists = await Task.findOne({ title, email });
    if (taskAlreadyExists) {
      return NextResponse.json(
        { success: false, error: "Task with this title already exists!!!" },
        { status: 400 }
      );
    }

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      isCompleted: false,
      email,
    });

    return NextResponse.json({ success: true, task: newTask });
  } catch (error) {
    console.log("Error creating task : ", error);
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PUT: Update Task Details
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  let { email } = resolvedParams;
  email = email.toLowerCase();

  try {
    const { _id, title, description, dueDate } = await req.json();
    if (!_id || !title || !description || !dueDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Task ID, Title, Description and Due Date are required",
        },
        { status: 400 }
      );
    }

    const task = await Task.findById(_id);
    // Task not found
    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    // Unauthorized request
    if (task.email !== email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update task
    const updatedTask = await Task.findOneAndUpdate(
      { _id, email },
      { title, description, dueDate },
      { new: true }
    );

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.log("Error updating task : ", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// PATCH: Update Task Status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  await connectDB();

  const resolvedParams = await params;
  let { email } = resolvedParams;
  email = email.toLowerCase();

  try {
    const { _id, isCompleted } = await req.json();

    if (!_id || isCompleted === undefined || isCompleted === null) {
      console.log("Task ID and isCompleted are required");
      return NextResponse.json(
        { success: false, error: "Task ID and isCompleted are required" },
        { status: 400 }
      );
    }

    const task = await Task.findById(_id);

    // Task not found
    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    // Unauthorized request
    if (task.email !== email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized Request" },
        { status: 401 }
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      { isCompleted: !isCompleted },
      { new: true }
    );

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.log("Error updating task : ", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE: Remove Task
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  await connectDB();
  const resolvedParams = await params;
  let { email } = resolvedParams;
  email = email.toLowerCase();

  try {
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await Task.findById(_id);

    // Task not found
    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    // Unauthorized request
    if (task.email !== email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized Request" },
        { status: 401 }
      );
    }

    await Task.findByIdAndDelete(_id);
    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting task : ", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
