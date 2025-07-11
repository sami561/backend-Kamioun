import { Request, Response } from 'express';
import CustomerModel from '../model/customer.model';
import { NotFoundError } from '../errors/not-found.error';
import fetchAndStoreCustomers from '../utils/fetchCustomers';

export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  const count = await CustomerModel.countDocuments();
  if (count === 0) {
    await fetchAndStoreCustomers();
  }
  const customers = await CustomerModel.find({});
  res.json(customers);
};

export const getCustomer = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let customer = await CustomerModel.findById(id);

  if (!customer) {
    await fetchAndStoreCustomers();
    customer = await CustomerModel.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
  }

  res.json(customer);
};
