# PostgreSQL Backend Setup

## Environment

Copy `.env.example` to `.env` and set `DATABASE_URL` to a PostgreSQL connection string. Keep credentials in `.env` for development and in the deployment platform's server-side secret store in production. Never use a `NEXT_PUBLIC_` prefix for database or payment secrets.

`ORDER_SHIPPING_AMOUNT` is a server-only INR shipping amount and defaults to `0.00` until a shipping policy is configured. `SEED_DEFAULT_STOCK` is used only when a catalog product is first created by the seed; it defaults to `0` to avoid inventing inventory.

Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from the Razorpay Dashboard in test mode. The key ID is sent to Checkout.js; the secret stays server-only and is used only by payment API routes. Do not prefix either variable with `NEXT_PUBLIC_`.

## Initialize or update the database

With PostgreSQL running and `DATABASE_URL` configured:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

For a deployed environment, run `npx prisma migrate deploy` during the release process. Do not run `migrate dev` against production.

The seed imports the existing frontend catalog. It may update catalog descriptions/images on rerun, but it deliberately does not overwrite an existing product's price or stock. Set real prices and inventory through an authenticated admin process before accepting orders.

## API

- `GET /api/products` supports optional `category`, `search`, and `limit` query parameters.
- `GET /api/products/[slug]` returns one active catalog product.
- `POST /api/orders` accepts customer/address data and product IDs, quantities, and selected variants. It rejects client-supplied totals/prices, fetches current products, decrements stock transactionally, and computes totals on the server.
- `GET /api/orders/[id]` requires `Authorization: Bearer <orderAccessToken>`. The token is returned only when the order is created; only its SHA-256 hash is stored.
- `POST /api/payments/razorpay/order` creates or reuses a provider order using the stored database total.
- `POST /api/payments/razorpay/verify` verifies the HMAC signature and fetches the provider payment before marking an order paid.
- `POST /api/payments/razorpay/failure` records only a failure confirmed by a server-side Razorpay lookup.

Product prices and order amounts use PostgreSQL `Decimal`. `OrderItem.priceAtPurchase` preserves the price charged at order time. The order access token is set in a per-order HttpOnly cookie and only its hash is stored. Payment callbacks never change an order to paid without server signature and provider-state verification.

## Razorpay test mode

1. Create or select a test-mode key pair in the Razorpay Dashboard.
2. Put the key ID and secret in local `.env` (or deployment server secrets), using the names above.
3. Ensure PostgreSQL is migrated and seeded with real prices and positive stock for test products.
4. Start the app, create an order from checkout, and use Razorpay's test payment methods.
5. Confirm the browser redirects to `/order-success/[orderId]` only after server verification returns `verified: true`.

Closing the checkout modal leaves the internal order pending for retry. Account order history is not exposed until an authentication/session system and a user-to-order ownership relation are added.
