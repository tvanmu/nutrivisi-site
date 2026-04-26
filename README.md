# Nutrivisi Site

Vite/React site for Nutrivisi.

## Development

```bash
npm install
npm run dev
```

## Contact Form

The contact form posts to `api/contact.js` and sends via Resend on Vercel. Configure these environment variables in Vercel:

- `RESEND_API_KEY` required
- `CONTACT_FROM_EMAIL` optional, defaults to `Nutrivisi <website@nutrivisi.be>`
- `CONTACT_TO_EMAIL` optional, defaults to `info@nutrivisi.be`

The `CONTACT_FROM_EMAIL` domain must be verified in Resend for production delivery.

## Checks

```bash
npm run lint
npm run build
```
