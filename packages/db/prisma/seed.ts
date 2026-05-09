import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Seed Users
  const users = [
    { id: 'ceo_fusion', name: 'CEO Hi Fusion', email: 'ceo@hifusion.vn', role: 'ceo', team: 'Management', slackId: 'U123CEO' },
    { id: 'leader_online', name: 'Trưởng nhóm Online', email: 'leader.online@hifusion.vn', role: 'leader', team: 'Online Sales', slackId: 'U123L_ON' },
    { id: 'leader_cs', name: 'Trưởng nhóm CS', email: 'leader.cs@hifusion.vn', role: 'leader', team: 'Customer Service', slackId: 'U123L_CS' },
    { id: 'executor_online_1', name: 'NV Online 1', email: 'online1@hifusion.vn', role: 'executor', team: 'Online Sales', slackId: 'U123E_ON1' },
    { id: 'executor_cs_1', name: 'NV CS 1', email: 'cs1@hifusion.vn', role: 'executor', team: 'Customer Service', slackId: 'U123E_CS1' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  // 2. Seed Rules A1-A4
  const rules = [
    {
      code: 'A1',
      name: 'ROAS Quảng cáo giảm sâu',
      description: 'Cảnh báo khi ROAS TikTok Shop / Shopee < 5.5 trong 30 phút',
      source: 'ADS_API',
      metric: 'roas',
      windowSeconds: 1800,
      thresholdExpr: 'val < 5.5',
      severityFormula: 'val < 4.0 ? "P1" : "P2"',
      channelTarget: '#online-ops',
      mentionList: ['leader_online'],
      templateId: 'ADS_ALERT_TPL',
      buttons: [
        { label: '✅ Xác nhận', action: 'ack' },
        { label: '⏸ Tạm dừng Adset', action: 'pause_ads', role: 'leader' }
      ],
      escalationPolicy: { stage1_m: 10, stage2_m: 15 }
    },
    {
      code: 'A2',
      name: 'CS Response Time quá tải',
      description: 'First Response Time > 5 phút',
      source: 'CRM_CS',
      metric: 'frt',
      windowSeconds: 300,
      thresholdExpr: 'val > 5',
      severityFormula: 'val > 10 ? "P1" : "P2"',
      channelTarget: '#cs-realtime',
      mentionList: ['leader_cs'],
      templateId: 'CS_ALERT_TPL',
      buttons: [
        { label: '✅ Xác nhận', action: 'ack' },
        { label: '🤖 Bật AI Chatbot', action: 'enable_ai', role: 'leader' }
      ],
      escalationPolicy: { stage1_m: 5, stage2_m: 10 }
    },
    {
      code: 'A3',
      name: 'Cảnh báo Tồn kho an toàn',
      description: 'Stock cover < 1.5x demand 24h',
      source: 'WMS',
      metric: 'stock_cover',
      windowSeconds: 3600,
      thresholdExpr: 'val < 1.5',
      severityFormula: 'val < 1.0 ? "P1" : "P2"',
      channelTarget: '#logistics-stock',
      mentionList: ['leader_online'],
      templateId: 'STOCK_ALERT_TPL',
      buttons: [
        { label: '✅ Xác nhận', action: 'ack' },
        { label: '🔄 Điều chuyển kho', action: 'transfer_stock', role: 'leader' }
      ],
      escalationPolicy: { stage1_m: 20, stage2_m: 40 }
    },
    {
      code: 'A4',
      name: 'Hiệu suất Popup/QR thấp',
      description: 'Hiệu suất < 70% KPI hoặc tỷ lệ scan < 15%',
      source: 'POS_OFFLINE',
      metric: 'offline_perf',
      windowSeconds: 7200,
      thresholdExpr: 'val < 0.7',
      severityFormula: 'val < 0.5 ? "P1" : "P2"',
      channelTarget: '#offline-field',
      mentionList: ['ceo_fusion'],
      templateId: 'OFFLINE_ALERT_TPL',
      buttons: [
        { label: '✅ Xác nhận', action: 'ack' },
        { label: '🎟 Phát Coupon 15%', action: 'push_coupon' }
      ],
      escalationPolicy: { stage1_m: 30, stage2_m: 60 }
    }
  ];

  for (const rule of rules) {
    await prisma.rule.upsert({
      where: { code: rule.code },
      update: rule,
      create: rule,
    });
  }

  // 3. Seed 1 Shift today
  const todayStart = new Date();
  todayStart.setHours(8, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(17, 0, 0, 0);

  await prisma.shift.create({
    data: {
      team: 'Online Sales',
      userId: 'executor_online_1',
      channel: '#online-ops',
      startAt: todayStart,
      endAt: todayEnd,
    }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
