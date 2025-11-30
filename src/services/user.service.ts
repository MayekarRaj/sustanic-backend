import { prisma } from '../config/database';
import { config } from '../config/env';

export class UserService {
  async getDashboard(userId: string) {
    // Get wallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Get latest water quality log
    const latestQuality = await prisma.waterQualityLog.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return {
      wallet_balance: wallet.balance,
      water_quality: latestQuality
        ? {
            ph: latestQuality.ph,
            tds: latestQuality.tds,
            turbidity: latestQuality.turbidity,
          }
        : null,
      allowed_quantities: config.allowedQuantities,
    };
  }

  async getWallet(userId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return {
      balance: wallet.balance,
    };
  }
}

