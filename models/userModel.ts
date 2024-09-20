import mongoose, { model, Schema } from 'mongoose';
import { User } from '../types/types';

const userSchema: Schema<User> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    fullName: {
      type: String,
      default: 'User',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'candidate', 'company'],
      required: [true, 'Role is required'],
    },
    profile_picture: {
      type: String,
      default: 'https://i.ibb.co.com/6F9w4Ps/boy.png',
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<User>('User', userSchema);

export default UserModel;
