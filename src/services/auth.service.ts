import { prisma } from '../config/database';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';
import { config } from '../config/env';

export class AuthService {
  async scanLogin(qrCode: string) {
    // Find user by QR code
    const user = await prisma.user.findUnique({
      where: { qrCode },
    });

    if (!user) {
      throw new AppError(401, 'Invalid QR code');
    }

    // Create or get wallet for user
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });
    }

    // Create auth session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const session = await prisma.authSession.create({
      data: {
        userId: user.id,
        jwtToken: '', // Will be set after token generation
        expiresAt,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      sessionId: session.id,
    });

    // Update session with token
    await prisma.authSession.update({
      where: { id: session.id },
      data: { jwtToken: token },
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  async logout(sessionId: string) {
    await prisma.authSession.delete({
      where: { id: sessionId },
    });

    return { success: true, message: 'Logged out successfully' };
  }
}

