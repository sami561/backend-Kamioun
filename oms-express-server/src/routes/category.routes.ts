import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares';
import { getAllCategories, getCategory } from '../handlers/category.handlers';

const router = Router();

router.get('/', authMiddleware, getAllCategories);
router.get('/:id', authMiddleware, getCategory);

export default router;
