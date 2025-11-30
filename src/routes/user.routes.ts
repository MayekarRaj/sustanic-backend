import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/dashboard', authenticate, (req, res) => {
  userController.getDashboard(req, res);
});

router.get('/wallet', authenticate, (req, res) => {
  userController.getWallet(req, res);
});

export default router;

