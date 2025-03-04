import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;

  username: string;
  linkedinId: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  lastLogin?: Date;
  isActive: boolean;
}

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },
  linkedinId: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);