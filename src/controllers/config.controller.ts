import { Request, Response } from 'express';
import { ConfigService } from '../services/config.service';

const configService = new ConfigService();

export class ConfigController {
  async getQuantities(req: Request, res: Response): Promise<void> {
    const result = configService.getQuantities();
    res.json({
      success: true,
      ...result,
    });
  }
}

