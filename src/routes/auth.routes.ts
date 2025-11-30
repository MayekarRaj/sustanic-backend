import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validator.middleware';
import { scanLoginSchema } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/scan-login', validate(scanLoginSchema), (req, res) => {
  authController.scanLogin(req, res);
});

router.post('/logout', (req, res) => {
  authController.logout(req, res);
});

export default router;

