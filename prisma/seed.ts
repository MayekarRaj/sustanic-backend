import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users with QR codes
  const users = [
    {
      qrCode: 'QR_USER_001',
      name: 'John Doe',
      phone: '+1234567890',
    },
    {
      qrCode: 'QR_USER_002',
      name: 'Jane Smith',
      phone: '+1234567891',
    },
    {
      qrCode: 'QR_USER_003',
      name: 'Bob Johnson',
      phone: '+1234567892',
    },
    {
      qrCode: 'QR_USER_004',
      name: 'Alice Williams',
      phone: null,
    },
    {
      qrCode: 'QR_USER_005',
      name: 'Charlie Brown',
      phone: '+1234567894',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { qrCode: userData.qrCode },
      update: {},
      create: userData,
    });

    // Create wallet for user with initial balance
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balance: Math.floor(Math.random() * 1000) + 100, // Random balance between 100-1100
      },
    });

    console.log(`✅ Created user: ${user.name} (QR: ${user.qrCode})`);
  }

  // Create sample water quality logs
  const qualityLogs = [
    { ph: 7.2, tds: 150, turbidity: 0.5 },
    { ph: 7.0, tds: 145, turbidity: 0.4 },
    { ph: 7.1, tds: 148, turbidity: 0.45 },
    { ph: 6.9, tds: 152, turbidity: 0.5 },
    { ph: 7.3, tds: 147, turbidity: 0.42 },
  ];

  for (const logData of qualityLogs) {
    await prisma.waterQualityLog.create({
      data: logData,
    });
  }

  console.log(`✅ Created ${qualityLogs.length} water quality logs`);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

