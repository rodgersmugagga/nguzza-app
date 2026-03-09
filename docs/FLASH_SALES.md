# Flash Sales

Flash sales are now controlled centrally by admins.

## Admin Workflow

In **Admin Dashboard → Flash Sales**:

1. Select approved products.
2. Set a future `Ends at` date/time.
3. (Optional) Keep **Reset existing flash sales first** enabled to replace previous campaigns.
4. Click **Publish Flash Sale**.

## Reset Options

- **Reset All**: clears every active flash sale.
- **Reset** on a single product: clears flash sale state for that product only.

## API Endpoints

All endpoints are admin-protected (`/api/admin`).

- `POST /flash-sales`
  - Body:
    - `productIds: string[]`
    - `endsAt: string` (ISO date)
    - `resetExisting?: boolean`
- `PUT /flash-sales/reset`
  - Clears all active flash sales.
- `PUT /flash-sales/:productId/reset`
  - Clears a single product flash sale.

## Product Fields

Flash sales are persisted on products as:

- `isFlashSale: boolean`
- `flashSaleStartsAt: Date | null`
- `flashSaleEndsAt: Date | null`

Only active flash sales (`isFlashSale=true` and `flashSaleEndsAt > now`) are shown in the Home page flash section.
