import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { config } from '../config/env';
import { DispenseStatus } from '@prisma/client';

export class DispenseService {
  async startDispense(userId: string, quantityMl: number) {
    // Validate quantity
    if (!config.allowedQuantities.includes(quantityMl)) {
      throw new AppError(400, `Invalid quantity. Allowed quantities: ${config.allowedQuantities.join(', ')}`);
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    // Calculate cost (assuming 1 unit per 100ml, adjust as needed)
    const costPer100Ml = 10; // 10 currency units per 100ml
    const cost = Math.ceil((quantityMl / 100) * costPer100Ml);

    // Check balance
    if (wallet.balance < cost) {
      throw new AppError(400, `Insufficient balance. Required: ${cost}, Available: ${wallet.balance}`);
    }

    // Create dispense request
    const dispenseRequest = await prisma.dispenseRequest.create({
      data: {
        userId,
        quantityMl,
        status: DispenseStatus.PENDING,
      },
    });

    return {
      dispense_id: dispenseRequest.id,
      quantity_ml: quantityMl,
      cost,
      message: 'Dispense request created. Please proceed with hardware dispensing.',
      hardware_instruction: {
        action: 'start_dispense',
        quantity_ml: quantityMl,
        dispense_id: dispenseRequest.id,
      },
    };
  }

  async completeDispense(userId: string, dispenseId: string, status: string) {
    // Find dispense request
    const dispenseRequest = await prisma.dispenseRequest.findUnique({
      where: { id: dispenseId },
    });

    if (!dispenseRequest) {
      throw new AppError(404, 'Dispense request not found');
    }

    if (dispenseRequest.userId !== userId) {
      throw new AppError(403, 'Unauthorized access to this dispense request');
    }

    // Validate status
    const validStatuses = ['COMPLETED', 'FAILED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      throw new AppError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const newStatus = status.toUpperCase() as DispenseStatus;

    // Calculate cost
    const costPer100Ml = 10;
    const cost = Math.ceil((dispenseRequest.quantityMl / 100) * costPer100Ml);

    // Update dispense request and wallet in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update dispense request
      const updatedRequest = await tx.dispenseRequest.update({
        where: { id: dispenseId },
        data: {
          status: newStatus,
          completedAt: new Date(),
        },
      });

      // If completed, deduct from wallet and create transaction
      if (newStatus === DispenseStatus.COMPLETED) {
        // Update wallet
        const wallet = await tx.wallet.update({
          where: { userId },
          data: {
            balance: {
              decrement: cost,
            },
          },
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
            userId,
            amount: -cost,
            description: `Water dispense: ${dispenseRequest.quantityMl}ml`,
          },
        });

        return { updatedRequest, wallet };
      }

      // If failed, just return the updated request
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      return { updatedRequest, wallet };
    });

    return {
      success: true,
      dispense_id: dispenseId,
      status: newStatus,
      wallet_balance: result.wallet?.balance || 0,
      amount_deducted: newStatus === DispenseStatus.COMPLETED ? cost : 0,
    };
  }

  async isAllowedToDispense(quantity: number): Promise<boolean> {
    return config.allowedQuantities.includes(quantity);
  }
}

