const { MongoClient, ServerApiVersion } = require('mongodb');
import mongoose from 'mongoose';

import app from '../app';

/* eslint-disable no-undef */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  next();
});
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const DB: any = process.env.DATABASE;

export const connect: any = async () => {
  const connectionParams: any = {
    useNewUrlParser: true,
    serverApi: ServerApiVersion.v1,
  };
  try {
    await mongoose.connect(DB, connectionParams);
    console.clear();
    console.log('Database connected');
  } catch (err) {
    console.log('Database connection error', err);
  }
};
