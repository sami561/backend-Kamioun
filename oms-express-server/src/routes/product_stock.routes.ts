import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares';
import { getAllProductStocks, getProductStock } from '../handlers/product_stock.handlers';

const router = Router();

router.get('/', authMiddleware, getAllProductStocks);
router.get('/:id', authMiddleware, getProductStock);

export default router;
