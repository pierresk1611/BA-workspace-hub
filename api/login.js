// Vercel Serverless Function: /api/login
// Reads credentials from environment variables only.
// SECURITY: Never commit real credentials. Set in Vercel Project Settings.

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  const validUsername = process.env.LOGIN_USERNAME;
  const validPassword = process.env.LOGIN_PASSWORD;

  if (!validUsername || !validPassword) {
    // Env vars not configured — fail safely
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (username === validUsername && password === validPassword) {
    // Return a simple session token (prototype-level, not production JWT)
    return res.status(200).json({
      ok: true,
      token: 'session_authenticated',
      username: validUsername
    });
  }

  return res.status(401).json({ ok: false, error: 'Invalid credentials' });
}
