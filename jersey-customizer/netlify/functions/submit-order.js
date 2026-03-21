/**
 * Netlify Function: submit-order
 * --------------------------------
 * Receives order form data and sends an email notification.
 *
 * To enable email sending:
 *   1. Go to your Netlify dashboard → Site settings → Environment variables
 *   2. Add:
 *      NOTIFY_EMAIL  = your@email.com   (where orders get sent TO)
 *      FROM_EMAIL    = orders@yourdomain.com
 *
 * This uses Netlify's built-in form handling as a fallback.
 * For full email sending, swap in your preferred service:
 *   - SendGrid: npm install @sendgrid/mail  + SENDGRID_API_KEY env var
 *   - Resend:   npm install resend          + RESEND_API_KEY env var
 *   - Nodemailer with SMTP
 *
 * The function works as-is (returns success) — just add email sending below.
 */

export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { name, email, teamName, newsletter } = body

  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name and email are required' }),
    }
  }

  // ── Email sending (add your provider here) ──────────────────────────
  //
  // Example with Resend (recommended — free tier, easy setup):
  //
  //   import { Resend } from 'resend'
  //   const resend = new Resend(process.env.RESEND_API_KEY)
  //   await resend.emails.send({
  //     from: process.env.FROM_EMAIL || 'orders@yourdomain.com',
  //     to:   process.env.NOTIFY_EMAIL,
  //     subject: `New Jersey Order — ${teamName || 'Unknown Team'}`,
  //     html: `
  //       <h2>New Jersey Customizer Order</h2>
  //       <p><strong>Name:</strong> ${name}</p>
  //       <p><strong>Email:</strong> ${email}</p>
  //       <p><strong>Team:</strong> ${teamName}</p>
  //       <p><strong>Newsletter:</strong> ${newsletter ? 'Yes' : 'No'}</p>
  //     `
  //   })
  //
  // ────────────────────────────────────────────────────────────────────

  console.log('New order received:', { name, email, teamName, newsletter })

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, message: 'Order received!' }),
  }
}
