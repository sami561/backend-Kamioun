import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares';
import { getAllWarehouses, getWarehouse } from '../handlers/warehouse.handlers';

const router = Router();
router.get('/', authMiddleware, getAllWarehouses);
router.get('/:id', authMiddleware, getWarehouse);

export default router;
