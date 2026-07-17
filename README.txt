HERMOSA NAILS BOOKING V2

Vercel Environment Variables required:
1. DISCORD_WEBHOOK_URL = Discord webhook URL
2. DATABASE_URL = Neon Postgres connection string

Database setup:
- Vercel Project > Storage / Marketplace > install/connect Neon Postgres.
- Connect it to this Vercel project. DATABASE_URL is usually added automatically.
- Keep both variables Sensitive and enable Production + Preview.
- Redeploy the project.
- The bookings table creates itself automatically on the first booking.

Pages:
/              New booking
/manage.html   Appointment Manage

Features:
- 1 to 7 guests
- Multiple services per guest
- Separate staff per guest
- Representative name and phone
- 6-character booking code
- Database storage
- Customer lookup and editing
- Discord notification with exact before/after changes
- Past dates disabled
- Cancellation by salon phone only
