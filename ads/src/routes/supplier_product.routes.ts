import { Router } from 'express';
import { getSupplierProducts } from '../handlers/product.handlers';
import { authMiddleware } from '../middlewares/auth.middlewares';

const router = Router();

router.get('/',authMiddleware, getSupplierProducts);

export default router;
