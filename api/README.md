# Nguzza API

Express backend for Nguzza marketplace.

## Areas

- Authentication and authorization
- Products and search
- Orders, cart, wishlist
- Admin operations
- Reference data (crop types, breeds)

## Flash Sale Support

Admin endpoints under `/api/admin`:

- `POST /flash-sales`
- `PUT /flash-sales/reset`
- `PUT /flash-sales/:productId/reset`

Product list endpoint `/api/products` supports `flashSaleOnly=true` to return only active flash campaigns.
