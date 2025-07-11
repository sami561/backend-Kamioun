import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Supplier from '../model/supplier.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_strong_secret_here';
const JWT_EXPIRES_IN = '1d';

// Super Admin Login
export const superAdminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign(
      { role: 'superAdmin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return res.json({ token, user: { role: 'superAdmin' } });
  }
  res.status(401).json({ message: 'Invalid credentials' });
};

// Supplier Login
export const supplierLogin = async (req: Request, res: Response) => {
  try {
    const { company_name, phone_number } = req.body;

    const supplier = await Supplier.findOne({ company_name })
      .select('-__v')
      .lean();

    if (!supplier || supplier.phone_number !== phone_number) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        role: 'supplier',
        supplierId: supplier._id,
        company: supplier.company_name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ 
      token,
      user: {
        ...supplier,
        role: 'supplier'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};