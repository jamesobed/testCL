import { Request, Response } from 'express';
import { shipmentDetailsSchema, options } from '../utils/utils';
import { ShipmentDetails, Shipment } from '../model/shipmentModel';

export async function createShipment(req: Request | any, res: Response) {
  const shipmentDetails: ShipmentDetails = req.body;

  try {
    const { id } = req.user;
    const validationResult = shipmentDetailsSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const shipment = await Shipment.create({ ...shipmentDetails, userID: id });
    res.json(shipment);
  } catch (error) {
    // console.error(error);
    res.status(500).send('Error creating shipment');
  }
}

export async function getAllUserShipment(req: Request | any, res: Response) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const { id } = req.user;
    const allUserShipment = await Shipment.find({ userID: id })
      .sort({ updatedAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();
    res.json({
      allUserShipment,
      currentPage: page,
      hasPreviousPage: startIndex > 0,
      hasNextPage: endIndex < (await Shipment.countDocuments().exec()),
      nextPage: page + 1,
      previousPage: page - 1,
      limit,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send('Error getting shipment');
  }
}
