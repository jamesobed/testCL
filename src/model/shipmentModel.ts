import mongoose, { Schema, Document } from 'mongoose';

export interface ShipmentDetails {
  userID?: string;
  shipment_title: string;
  shipment_description: string;
  shipment_weight: string;
  images: string[];
  current_location: {
    country: string;
    state: string;
    city: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  recipient_full_name: string;
  recipient_email: string;
  shipment_destintion: {
    country: string;
    state: string;
    city: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  delivery_price: number;
}

interface ShipmentDetailsDocument extends ShipmentDetails, Document {}

const ShipmentDetailsSchema = new Schema<ShipmentDetailsDocument>(
  {
    userID: { type: String, required: true },
    shipment_title: { type: String, required: true },
    shipment_description: { type: String, required: true },
    shipment_weight: { type: String, required: true },
    images: { type: [String], required: true },
    current_location: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
    recipient_full_name: { type: String, required: true },
    recipient_email: { type: String, required: true },
    shipment_destintion: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
    delivery_price: { type: Number, required: true },
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

export const Shipment = mongoose.model<ShipmentDetailsDocument>('Shipment', ShipmentDetailsSchema);
