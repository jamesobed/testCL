import { Request, Response } from 'express';
import axios from 'axios';
import PaymentInstance from '../model/paystackModel';
import { v4 as uuidv4 } from 'uuid';
const Flutterwave = require('flutterwave-node-v3');
import { createPaymentSchema, options } from './../utils/utils';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY,
  paystackApiKey = process.env.PAYSTACK_SECRET_KEY,
  FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY,
  FLW_SECRET_KEY = process.env.FLW_SECRET_KEY,
  PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

const user = {
  name: '',
  email: '',
  wallet: 0,
  password: '',
};

const metadata = {
  customer_name: 'John Doe',
  customer_phone: '+2348165367712',
  order_id: Date.now().toString(),
  product_name: 'test Premium Subscription',
};

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

export async function confirmPayment(req: Request, res: Response) {
  try {
    const tx_ref = req.query.tx_ref;
    const transactionId = req.query.transaction_id;
    const response = await flw.Transaction.verify({ id: transactionId });
    // .then((response: { data: { status: string; amount: number; currency: string } }) => {
    if (
      response.data.status === 'successful'
      // &&
      // response.data.amount === expectedAmount &&
      // response.data.currency === expectedCurrency
    ) {
      // Success! Confirm the customer's payment
      console.log('it worked');
      res.send(response);
    } else {
      // Inform the customer their payment was unsuccessful
      res.send('response is affected by network error');
    }
  } catch (error) {
    res.send('error');
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const veriFiedInput = await createPaymentSchema.validate(req.body, options);
    if (veriFiedInput.error) {
      return res.status(400).json({
        Error: veriFiedInput.error.details[0].message,
      });
    }

    const { amount, email, name, phone_number, tx_ref } = req.body;

    const payment = await PaymentInstance.create({
      amount,
      email,
      name,
      phone_number,
      userId: Date.now().toString(),
      tx_ref,
    });

    return res.status(201).send(payment);
  } catch (err) {
    console.log(err);
  }
}

export const verifyPayment = async (req: Request, res: Response): Promise<unknown> => {
  try {
    const { paymentId } = req.body;

    const existingPayment = await PaymentInstance.findById(paymentId);

    if (!existingPayment) {
      return res.send('Payment not initialized');
    }

    if (existingPayment.paymentStatus !== 'PENDING') {
      return res.send('Payment already verified');
    }

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${paymentId}`, {
      headers: {
        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'content-type': 'application/json',
        'cache-control': 'no-cache',
      },
    });
    const data = response.data.data;
    if (data.status === 'success') {
      existingPayment.paymentStatus = 'SUCCESS';
      await existingPayment.save();
      return res.send('Payment successful');
    } else {
      existingPayment.paymentStatus = 'FAILED';
      await existingPayment.save();
      return res.send('Payment failed');
    }
  } catch (err) {
    console.log(err);
  }
};
