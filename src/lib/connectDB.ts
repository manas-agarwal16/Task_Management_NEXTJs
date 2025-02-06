import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
}

const connection : ConnectionObject = {}; 

const connectDB = async (): Promise<void> => {
  //If MongoDB is already connected
  if(connection.isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const mongoUrl = process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error('MONGODB_URL environment variable is not defined');
    }

    const db = await mongoose.connect(mongoUrl);
    connection.isConnected = db.connections[0].readyState;

    console.log('Connected to MongoDB Successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
