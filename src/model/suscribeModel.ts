//  create a new mongoose schema for suscribe with a field of email

import * as mongoose from 'mongoose';

// create interface for model
export interface Suscribe extends mongoose.Document {
  email: string;
  date: string;
}

const suscribeSchema = new mongoose.Schema(
  {
    email: String,
    date: String,
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

const Suscribe = mongoose.model('Suscribe', suscribeSchema);

export default Suscribe;
