import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async getDashboard(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const result = await userService.getDashboard(req.user.id);
    res.json({
      success: true,
      ...result,
    });
  }

  async getWallet(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const result = await userService.getWallet(req.user.id);
    res.json({
      success: true,
      ...result,
    });
  }
}

