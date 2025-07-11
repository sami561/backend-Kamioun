import { Router } from 'express';
import { authenticateApiKey } from '../middlewares/apiKeyMiddleware';
import {
  updateScreen,
  getScreen,
  deleteScreen,
  getAllScreens,
  getScreens,
  createScreen,
  activateScreen,
  deactivateScreen,
  getScreenByTitle,
} from '../handlers/screen.handlers';
const router = Router();
router.put('/:id', authenticateApiKey, updateScreen);
router.get('/all', getAllScreens);
router.delete('/:id', authenticateApiKey, deleteScreen);
router.get('/:id', authenticateApiKey, getScreen);
router.post('/', createScreen);
router.put('/:screenId/activate', authenticateApiKey, activateScreen);
router.put('/:screenId/deactivate', authenticateApiKey, deactivateScreen);
router.get('/screens/:title', authenticateApiKey, getScreenByTitle);
export default router;
