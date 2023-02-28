import { Schema, model } from 'mongoose';
import { ticketHistoryAttribute } from './ticketModel';

export interface orderAttribute {
  orderTitle?: string;
  orderBody?: string;
  orderImage?: string;
  pickUpLocation?: string;
  dropOffLocation?: string;
  receipentNumber?: string;
  contacttNumber?: string;
  userId?: string;
  date?: string;
  tickets?: ticketHistoryAttribute;
  shipmentStatus?: string;
}

export const orderModelSchema = new Schema<orderAttribute>(
  {
    orderTitle: {
      type: String,
      allowNull: false,
    },
    pickUpLocation: {
      type: String,
      allowNull: false,
    },
    dropOffLocation: {
      type: String,
      allowNull: false,
    },

    orderBody: {
      type: String,
      allowNull: false,
    },

    orderImage: {
      type: String,
      allowNull: false,
    },
    receipentNumber: {
      type: String,
      allowNull: false,
    },
    contacttNumber: {
      type: String,
      allowNull: false,
    },

    userId: {
      type: String,
      allowNull: false,
    },
    shipmentStatus: {
      type: String,
      enum: ['created', 'approved', 'pending', 'returned', 'delivered'],
      default: 'created',
    },

    date: {
      type: Date,
      default: Date.now(),
    },
    tickets: [{ type: Schema.Types.ObjectId, ref: 'tickets' }],
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

orderModelSchema.index({ $orderTitle: 'text', $receipentNumber: 'text' });

export let OrderInstance = model('orders', orderModelSchema);
