import express, { Request, Response, NextFunction } from 'express';
// import  client, {accountSid, authToken} from  'twilio';
import { Twilio } from 'twilio';
import { userInstance } from '../model/userModel';
import { generateOtp, options } from '../utils/utils';
import sendMail from './FILE/email/sendMails';

export const sendOTP = async (req: Request | any, res: Response, next: NextFunction) => {
  const { purpose } = req.body;

  // JOI VALIDATION
  const validationResult = generateOtp.validate(req.body, options);
  if (validationResult.error) {
    return res.status(400).json({
      Error: validationResult.error.details[0].message,
    });
  }

  // TWILIO ACCOUNT DETAILS
  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;

  // TWILIO CLIENT
  const client = new Twilio(accountSid, authToken);

  // GENERATE OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const { id } = req.user;
  const user = await userInstance.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await user.update({ otp, otpExpires: Date.now() + 300000 });

  // SEND OTP TO EMAIL
  sendMail.sendOTP(user.email, purpose, otp);

  // SEND OTP TO USER PHONE NUMBER
  const phoneNumber = user.phoneNumber!;

  try {
    const sms = await client.messages.create({
      from: twilioNumber,
      to: '+234' + phoneNumber.slice(1, phoneNumber.length),
      body: `This is your OTP ${purpose}:  ${otp} it expires in 5 minutes`,
    });
    if (sms) {
      return res.status(201).json({
        status: 'success',
        message: 'SMS sent successfully',
        data: otp,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
      error,
    });
  }
};
