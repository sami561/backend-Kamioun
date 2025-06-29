import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Manufacturer from '../model/supplier.model';

dotenv.config();
const router = express.Router();

const escapeRegex = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Super Admin login
    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign(
        { userId: 'admin', role: 'superadmin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          role: 'superadmin',
          username: 'admin'
        }
      });
    }


    // Intern login
    if (username === 'intern' && password === 'intern') {
      const token = jwt.sign(
        { userId: 'intern', role: 'intern' },
        process.env.JWT_SECRET! 
      );
    
      return res.json({
        success: true,
        token,
        user: {
          role: 'superadmin',
          username: 'intern'
        }
      });
    }


    // Intern login
    if (username === 'user' && password === 'user123') {
      const token = jwt.sign(
        { userId: 'user', role: 'user' },
        process.env.JWT_SECRET!
        
      );

      return res.json({
        success: true,
        token,
        user: {
          role: 'superadmin',
          username: 'user'
        }
      });
    }



    // Supplier login
    const supplier = await Manufacturer.findOne({
      company_name: { 
        $regex: new RegExp(`^${escapeRegex(username)}$`, 'i') 
      },
      phone_number: password
    });

    if (supplier) {
      const token = jwt.sign(
        { 
          userId: supplier.manufacturerId,
          role: 'supplier',
          company: supplier.company_name
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          role: 'supplier',
          manufacturerId: supplier.manufacturerId,
          company_name: supplier.company_name,
          contact_name: supplier.contact_name,
          country: supplier.country,
          city: supplier.city,
          email: supplier.email,
          phone_number: supplier.phone_number,
          postal_code: supplier.postal_code
        }
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });

  } catch (error) {
    next(error);
  }
});

export default router;