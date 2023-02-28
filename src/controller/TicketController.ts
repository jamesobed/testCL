import { Request, Response, NextFunction } from 'express';
import { createTicketSchema, options } from '../utils/utils';
import { TicketHistoryInstance } from '../model/ticketModel';
import { userInstance } from '../model/userModel';

export const createTicket = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;

    const { ticketBody, firstName, lastName } = req.body;

    const validatedInput = await createTicketSchema.validate(req.body, options);
    if (validatedInput.error) {
      return res.status(400).json(validatedInput.error.details[0].message);
    }
    const user = await userInstance.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    if (user) {
      const ticket = await TicketHistoryInstance.create({
        userId,
        ticketBody,
        firstName,
        lastName,
      });

      const neworder = await userInstance.findByIdAndUpdate(
        userId,
        {
          $push: { tickets: ticket },
        },
        { new: true },
      );

      return res.status(201).json({
        message: 'You have successful raised a ticket',
        ticket,
      });
    } else {
      return res.status(400).json({ message: 'Network Error. Ticket not created' });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

// get all tickets
export const getAllTicket = async (req: Request | any, res: Response | any) => {
  try {
    const allticket = await TicketHistoryInstance.find();
    if (!allticket) {
      return res.status(404).json({ message: 'No ticket found' });
    }
    const groupedticket = allticket.reduce((acc: any, comment: any) => {
      const { orderID } = comment;
      if (!acc[orderID]) {
        acc[orderID] = [];
      }
      acc[orderID].push(comment);
      return acc;
    }, {});

    return res.status(200).json({ message: 'Sucessfully fetched all ticket' });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
