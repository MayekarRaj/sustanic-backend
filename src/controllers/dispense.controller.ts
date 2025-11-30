import { Request, Response } from 'express';
import { DispenseService } from '../services/dispense.service';

const dispenseService = new DispenseService();

export class DispenseController {
  async startDispense(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { quantity } = req.body;
    const result = await dispenseService.startDispense(req.user.id, quantity);
    res.json({
      success: true,
      ...result,
    });
  }

  async completeDispense(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { dispense_id, status } = req.body;
    const result = await dispenseService.completeDispense(
      req.user.id,
      dispense_id,
      status
    );
    res.json(result);
  }

  async isAllowedToDispense(req: Request, res: Response): Promise<void> {
    const quantity = parseInt(req.query.quantity as string, 10);
    
    if (isNaN(quantity)) {
      res.status(400).json({
        success: false,
        error: 'Invalid quantity parameter',
      });
      return;
    }

    const allowed = await dispenseService.isAllowedToDispense(quantity);
    res.json({
      success: true,
      allowed,
    });
  }
}

