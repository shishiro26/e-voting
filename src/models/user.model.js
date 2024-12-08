import mongoose from 'mongoose';
import paginate from '../plugins/paginate.js';

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'staff', 'owner'],
      default: 'user',
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      private: true,
    },
    refreshToken: [],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);

export default User;
