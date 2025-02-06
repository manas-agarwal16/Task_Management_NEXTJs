import mongoose, {Document , Schema} from "mongoose";

export interface Task extends Document {
    title: string;
    description: string;
    dueDate : Date;
    isCompleted: boolean;
    email : string;
}

const TaskSchema : Schema<Task> = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    isCompleted: {type: Boolean, default: false},
    email: {type: String, required: true}
});

const TaskModel = (mongoose.models.Task as mongoose.Model<Task>) || mongoose.model<Task>('Task', TaskSchema);

export default TaskModel;
