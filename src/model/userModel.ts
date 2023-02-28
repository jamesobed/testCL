import { Schema, model } from 'mongoose';
import { ticketHistoryAttribute } from './ticketModel';

export interface userAttributes {
  id: string;
  name: string;
  userName: string;
  address: string;
  email: string;
  phoneNumber?: string;
  password: string;
  avatar: string;
  isVerified?: Boolean;
  token?: string;
  role?: string;
  date?: string;
  wallet?: number;
  otp?: Number;
  otpExpires?: Number;
  tickets?: ticketHistoryAttribute;
}

export const UserSchema = new Schema<userAttributes>(
  {
    name: {
      type: String,
      required: [true, 'full name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide occupation'],
      trim: true,
    },
    email: {
      type: String,
      trim: false,
      required: [true, 'Please provide a valid email'],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: [true, 'no duplicate email is allowed'],
    },

    password: {
      type: String,
      required: [true, 'enter a password'],
      trim: true,
      min: 5,
      max: 200,
    },
    avatar: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nG8OgXmMOXXiwbNOc-PPXUcilcIhCkS9BQ&usqp=CAU',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'user',
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    tickets: [{ type: Schema.Types.ObjectId, ref: 'tickets' }],

    otp: {
      type: Number,
      default: null,
    },
    otpExpires: {
      type: Number,
      default: null,
    },
    wallet: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

UserSchema.index({ request: 'text' });
export let userInstance = model('User', UserSchema);
