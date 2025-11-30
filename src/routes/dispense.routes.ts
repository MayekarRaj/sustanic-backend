import { Router } from 'express';
import { DispenseController } from '../controllers/dispense.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validator.middleware';
import {
  startDispenseSchema,
  completeDispenseSchema,
  isAllowedToDispenseSchema,
} from '../validators/dispense.validator';

const router = Router();
const dispenseController = new DispenseController();

router.post('/start', authenticate, validate(startDispenseSchema), (req, res) => {
  dispenseController.startDispense(req, res);
});

router.post('/complete', authenticate, validate(completeDispenseSchema), (req, res) => {
  dispenseController.completeDispense(req, res);
});

router.get('/is-allowed-to-dispense', authenticate, validate(isAllowedToDispenseSchema), (req, res) => {
  dispenseController.isAllowedToDispense(req, res);
});

export default router;

