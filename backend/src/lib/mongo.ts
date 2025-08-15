
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/standups';

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
}

const updateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const UpdateModel = mongoose.model('Update', updateSchema);
