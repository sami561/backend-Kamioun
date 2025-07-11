import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares';
import { getAllSuppliers, getSupplier } from '../handlers/supplier.handlers';

const router = Router();

router.get('/', authMiddleware, getAllSuppliers);
router.get('/:id', authMiddleware, getSupplier);

export default router;
