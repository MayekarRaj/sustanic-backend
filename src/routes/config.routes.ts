import { Router } from 'express';
import { ConfigController } from '../controllers/config.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const configController = new ConfigController();

router.get('/quantities', authenticate, (req, res) => {
  configController.getQuantities(req, res);
});

export default router;

