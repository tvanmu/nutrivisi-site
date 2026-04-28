const CONTACT_EMAIL = 'info@nutrivisi.be';
const MAX_BODY_BYTES = 12_000;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);

  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) {
      throw new Error('request-too-large');
    }
  }

  return raw ? JSON.parse(raw) : {};
}

function cleanLine(value, maxLength = 160) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMessage(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, 4_000);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildEmailHtml({ name, company, email, message, language }) {
  const rows = [
    ['Naam', name],
    ['Bedrijf', company],
    ['E-mail', email],
    ['Taal', language],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#0b2530;line-height:1.55">
      <h1 style="font-size:20px;margin:0 0 18px">Nieuwe aanvraag via nutrivisi.be</h1>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="padding:6px 18px 6px 0;font-weight:700;color:#0a6f8f">${escapeHtml(label)}</td>
            <td style="padding:6px 0">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
      <div style="padding:18px;border:1px solid #d9edf2;border-radius:10px;background:#f5fbfc;white-space:pre-wrap">${escapeHtml(message)}</div>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { ok: false });
  }

  try {
    const body = await readJson(req);
    const website = cleanLine(body.website);
    const name = cleanLine(body.name);
    const company = cleanLine(body.company);
    const email = cleanLine(body.email, 220);
    const message = cleanMessage(body.message);
    const language = cleanLine(body.language || 'NL', 12);
    const subject = cleanLine(body.subject || `Aanvraag via website - ${company || 'Nutrivisi'}`, 180);

    if (website) {
      return sendJson(res, 200, { ok: true });
    }

    if (!name || !company || !email || !message || !isValidEmail(email)) {
      return sendJson(res, 400, { ok: false });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY for contact form delivery');
      if (!process.env.VERCEL) {
        return sendJson(res, 200, { ok: true, dev: true });
      }
      return sendJson(res, 503, { ok: false });
    }

    const payload = {
      from: process.env.CONTACT_FROM_EMAIL || 'Nutrivisi <website@nutrivisi.be>',
      to: [process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL],
      reply_to: email,
      subject,
      text: [
        'Nieuwe aanvraag via nutrivisi.be',
        '',
        `Naam: ${name}`,
        `Bedrijf: ${company}`,
        `E-mail: ${email}`,
        `Taal: ${language}`,
        '',
        'Vraag:',
        message,
      ].join('\n'),
      html: buildEmailHtml({ name, company, email, message, language }),
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error('Resend delivery failed', resendResponse.status, detail);
      return sendJson(res, 502, { ok: false });
    }

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('Contact form failed', error);
    return sendJson(res, 400, { ok: false });
  }
}
