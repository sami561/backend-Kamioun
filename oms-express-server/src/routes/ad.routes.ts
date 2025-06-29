import { Router } from 'express';
import {
  createAd,
  deleteAd,
  getAd,
  getAdImage,
  getAds,
  getAdsByPage,
  updateAd,
  getImage,
} from '../handlers/ad.handlers';
import { upload } from '../utils/multerConfig';
import { authenticateApiKey } from '../middlewares/apiKeyMiddleware';

const router = Router();

router.post(
  '/',
  [
    /* validationMiddleware(createAdDto), */ authenticateApiKey,
    upload.array('images', 5),
  ],
  createAd
);
router.put(
  '/:id',
  [
    authenticateApiKey,
    upload.fields([
      { name: 'images', maxCount: 5 },
      { name: 'backgroundImage', maxCount: 1 },
    ]),
  ],
  updateAd
);
router.get('/', authenticateApiKey, getAds);
router.get('/screen', authenticateApiKey, getAdsByPage);
router.delete('/:id', authenticateApiKey, deleteAd);
router.get('/:id/images/:filename', authenticateApiKey, getAdImage);
router.get('/:id', authenticateApiKey, getAd);
/* router.get('/uploads/:filePath(*)', getImageByFullPath); */
router.get('/uploads/:folder/:filename', getImage);
export default router;
