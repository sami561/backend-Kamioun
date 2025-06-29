import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares';
import { getAllCustomers, getCustomer } from '../handlers/customer.handlers';

const router = Router();

router.get('/', authMiddleware, getAllCustomers);
router.get('/:id', authMiddleware, getCustomer);

export default router;
