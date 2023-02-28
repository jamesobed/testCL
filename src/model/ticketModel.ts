import { Schema, model, connect } from 'mongoose';

export interface ticketHistoryAttribute {
  id: string;
  ticketBody: string;
  userId: string;
  orderID: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt?: Date;
}

export const ticketSchema = new Schema<ticketHistoryAttribute>(
  {
    ticketBody: {
      type: String,
      allowNull: false,
    },
    userId: {
      type: String,
      allowNull: false,
    },
    orderID: {
      type: String,
      defaultValue: false,
    },
    firstName: {
      type: String,
      allowNull: false,
    },
    lastName: {
      type: String,
      allowNull: false,
    },
    status: {
      type: String,
      enum: ['created', 'pending', 'treated'],
      default: 'created',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

ticketSchema.index({ $ticketBody: 'text', $firstName: 'text' });

export let TicketHistoryInstance = model('tickets', ticketSchema);
