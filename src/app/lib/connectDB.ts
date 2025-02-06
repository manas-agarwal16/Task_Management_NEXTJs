import mongoose from 'mongoose';

const connectMongoDB = async (): Promise<void> => {
  // Check if MongoDB is already connected
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error('MONGODB_URL environment variable is not defined');
    }

    // Connecting to MongoDB
    await mongoose.connect(mongoUrl);

    console.log('Connected to MongoDB Successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectMongoDB;
