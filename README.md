# Nguzza Marketplace

Nguzza is an agriculture marketplace for Uganda. It supports buyers, sellers, and admins across products such as crops, livestock, inputs, and equipment.

## Repository Structure

- `client/` – React + Vite frontend.
- `api/` – Express + MongoDB backend.
- `scripts/` – migration and support scripts.

## Core Features

- Product discovery with category and location filtering.
- Seller onboarding and listing management.
- Admin moderation for users, vendors, products, and orders.
- Flash sales configured from the admin dashboard.

## Flash Sales (Admin Managed)

Admins can now:

1. Choose one or more approved products.
2. Set the campaign end time.
3. Optionally reset existing flash campaigns before publishing.
4. Reset all flash sales or a single product’s flash sale from the dashboard.

See detailed workflow in [`docs/FLASH_SALES.md`](docs/FLASH_SALES.md).

## Local Development

### API

```bash
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

## Documentation

- [Admin Dashboard Guide](docs/ADMIN_DASHBOARD.md)
- [Flash Sales Guide](docs/FLASH_SALES.md)
