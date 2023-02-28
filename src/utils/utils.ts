import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { ShipmentDetails } from '../model/shipmentModel';
export const sendEmail = Joi.object().keys({
  from: Joi.string(),
  to: Joi.string().required(),
  subject: Joi.string().required(),
  text: Joi.string(),
  html: Joi.string().required(),
});

export const signUpSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    phoneNumber: Joi.string().required(),
    avatar: Joi.string(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
  })
  .with('password', 'confirmPassword');

export const updateUserSchema = Joi.object().keys({
  name: Joi.string(),
  occupation: Joi.string(),
  phoneNumber: Joi.string(),
  avatar: Joi.string(),
  dateOfBirth: Joi.string(),
  role: Joi.string(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});
export const fogotPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const resetPasswordSchema = Joi.object()
  .keys({
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
  })
  .with('password', 'confirmPassword');

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_DURATION as string;
  return jwt.sign(user, pass, { expiresIn });
};

export const createOrderSchema = Joi.object().keys({
  orderTitle: Joi.string().trim().required(),
  orderBody: Joi.string().trim().required(),
  dropOffLocation: Joi.string().required(),
  pickUpLocation: Joi.string().required(),
  receipentNumber: Joi.string(),
  contacttNumber: Joi.string(),
  orderImage: Joi.string(),
  OrderImage: Joi.string().trim(),
});

export const createTicketSchema = Joi.object().keys({
  ticketBody: Joi.string().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
});
export const createPaymentSchema = Joi.object().keys({
  tx_ref: Joi.string().required(),
  email: Joi.string().trim().required(),
  phone_number: Joi.string().trim().required(),
  amount: Joi.number().required(),
});

export const generateOtp = Joi.object().keys({
  purpose: Joi.string().required(),
});

export const suscribeSchema = Joi.object().keys({
  email: Joi.string().required(),
});

export const shipmentDetailsSchema = Joi.object<ShipmentDetails>({
  shipment_title: Joi.string().required(),
  shipment_description: Joi.string().required(),
  shipment_weight: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required(),
  current_location: Joi.object({
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }).required(),
  recipient_full_name: Joi.string().required(),
  recipient_email: Joi.string().email().required(),
  shipment_destintion: Joi.object({
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }).required(),
  delivery_price: Joi.number().required(),
});
