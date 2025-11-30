import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { JWTPayload } from '../middleware/auth.middleware';
import { config } from '../config/env';

const authService = new AuthService();

export class AuthController {
  async scanLogin(req: Request, res: Response): Promise<void> {
    const { scan_code } = req.body;
    const result = await authService.scanLogin(scan_code);
    res.json(result);
  }

  async logout(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      
      const result = await authService.logout(decoded.sessionId);
      res.json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }
  }
}

