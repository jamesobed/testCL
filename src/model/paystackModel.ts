//  create a new mongoose schema for suscribe with a field of email

import * as mongoose from 'mongoose';

// create interface for model
export interface PaymentInterface extends mongoose.Document {
  tx_ref: string;
  email: string;
  amount: number;
  paid: boolean;
  userId: string;
  paymentStatus: string;
  phone_number: string;
}

const paymentSchema = new mongoose.Schema(
  {
    tx_ref: String,
    amount: Number,
    paymentId: String,
    userId: String,
    email: String,
    phone_number: String,
    paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    paid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);
const PaymentInstance = mongoose.model('Payment', paymentSchema);

export default PaymentInstance;
