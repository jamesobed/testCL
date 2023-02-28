import { Request, Response, NextFunction } from 'express';
import { createOrderSchema, options } from '../utils/utils';
import sendMails from './FILE/email/sendMails';
import { userAttributes, userInstance } from '../model/userModel';
import { OrderInstance } from '../model/orderModel';

export async function createOrder(req: Request | any, res: Response) {
  const { orderTitle, orderBody, orderImage, pickUpLocation, dropOffLocation, receipentNumber, contacttNumber } =
    req.body;
  try {
    const userID = req.user.id;
    const ValidateOrder = await createOrderSchema.validateAsync(req.body, options);
    if (ValidateOrder.error) {
      return res.status(400).json({
        status: 'error',
        message: ValidateOrder.error.details[0].message,
      });
    }
    const user: userAttributes | any = await userInstance.findById(userID);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'you have to register an account before you can order for shipment' })
        .redirect(`${process.env.FRONTEND_URL}/register`);
    }

    const record = await OrderInstance.create({
      orderTitle,
      orderBody,
      orderImage,
      pickUpLocation,
      dropOffLocation,
      receipentNumber,
      contacttNumber,
      shipmentStatus: 'created' || req.body.shipmentStatus.toLowerCase(),
    });
    if (record) {
      const emails = user.email;

      const message = `A new order has been created by ${user.name} with the title: <b>${req.body.OrderTitle}</b>`;
      sendMails.OrderNotification(emails, message);

      return res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: record,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}
export async function getAllUserOrder(req: Request | any, res: Response) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const userId = req.user.id;
    const allOrder = await OrderInstance.findById(userId)
      .populate('tickets')
      .sort({ date: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();
    if (allOrder) {
      return res.status(200).json({
        status: 'success',
        message: 'all User Orders retrieved successfully',
        data: allOrder,
        currentPage: page,
        hasPreviousPage: startIndex > 0,
        hasNextPage: endIndex < (await OrderInstance.countDocuments().exec()),
        nextPage: page + 1,
        previousPage: page - 1,
        limit,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function getAllOrder(req: Request | any, res: Response) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const allOrder = await OrderInstance.find({})
      .sort({ date: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('tickets')
      .exec();
    if (allOrder) {
      // get all Order, comments and Order author
      return res.status(200).json({
        status: 'success',
        message: 'all Order retrieved successfully',
        data: allOrder,
        currentPage: page,
        hasPreviousPage: startIndex > 0,
        hasNextPage: endIndex < (await OrderInstance.countDocuments().exec()),
        nextPage: page + 1,
        previousPage: page - 1,
        limit,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function deleteOrder(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const Order = await OrderInstance.findByIdAndDelete({
      id,
    });
    if (Order) {
      return res.status(200).json({
        status: 'success',
        message: 'Order deleted successfully',
      });
    }
    return res.status(404).json({
      status: 'error',
      message: 'Order not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}

export async function getSingleOrder(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const Order = await OrderInstance.findById(id).populate('comments').sort({ createdAt: -1 }).exec();

    if (Order) {
      return res.status(200).json({
        status: 'success',
        message: 'Order retrieved successfully',
        data: Order,
      });
    }
    return res.status(404).json({
      status: 'error',
      message: 'Order not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
