# Realtime Alert & Escalation System - Hi Fusion

Hệ thống giám sát anomaly thời gian thực và quản lý quy trình leo thang tự động cho Hi Fusion.

## 🚀 Cài đặt nhanh (Quick Start)

1. **Yêu cầu hệ thống:** Node.js 20+, pnpm, Docker.
2. **Khởi chạy hạ tầng (Postgres, Redis):**
   ```bash
   docker-compose up -d postgres redis
   ```
3. **Cài đặt dependencies:**
   ```bash
   pnpm install
   ```
4. **Cấu hình Database:**
   ```bash
   cd packages/db
   npx prisma db push
   npx prisma db seed
   ```
5. **Chạy ứng dụng (Dev mode):**
   ```bash
   pnpm dev
   ```

## 🏗 Kiến trúc Monorepo

- `apps/api`: REST API & Webhooks (Slack/Teams/Zalo).
- `apps/admin-web`: Giao diện quản trị Next.js.
- `apps/worker`: Xử lý quét anomaly (cron) và escalation (BullMQ).
- `packages/shared`: Chứa logic rule engine và types dùng chung.
- `packages/db`: Prisma schema và client.

## 🛠 Cách thêm Rule mới

Bạn có thể thêm rule mới trực tiếp qua Admin UI tại trang `/rules` hoặc thêm vào file `packages/shared/src/rules/default-rules.json` và chạy lại seed.

## 📅 Định dạng Timestamp

Mọi thời điểm hiển thị trên UI và thông báo đều tuân thủ định dạng: `DD-MM-YYYY HH:MM` (GMT+7).
