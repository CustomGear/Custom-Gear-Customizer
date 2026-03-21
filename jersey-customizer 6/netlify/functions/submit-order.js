export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  let body
  try { body = JSON.parse(event.body) } catch { return { statusCode: 400, body: 'Invalid JSON' } }
  const { name, email, teamName, newsletter } = body
  if (!name || !email) return { statusCode: 400, body: JSON.stringify({ error: 'Name and email required' }) }

  // Add your email provider here (Resend, SendGrid, etc.)
  // See README for setup instructions
  console.log('New order:', { name, email, teamName, newsletter })

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  }
}
