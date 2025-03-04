import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define an interface for User document with the comparePassword method
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  isActive: boolean;
  subscription?: {
    status: 'free' | 'paid';
    startDate?: Date;
    endDate?: Date;
    paymentHistory?: Array<{
      amount: number;
      date: Date;
      transactionId: string;
    }>;
  };
  reportsSubmitted: number;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscription: {
    status: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    paymentHistory: [{
      amount: Number,
      date: Date,
      transactionId: String
    }]
  },
  reportsSubmitted: {
    type: Number,
    default: 0
  },
  lastLogin: Date
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to check password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);