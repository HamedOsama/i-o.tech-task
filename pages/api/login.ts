import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });
  // Get the email and password from the request body
  const { email, password } = req.body;

  // Check if email and password match the expected values
  if (email === 'test@iotech.com' && password === 'iotech1234') {

    // If the email and password are correct, return a success response
    // with a Set-Cookie header containing the session token
    res.setHeader('Set-Cookie', 'IOsession=loggedIn; HttpOnly; SameSite=Strict ; Path=/ ; Max-Age=96000 ; secure=true ');
    res.status(200).json({ success: true });
  } else {
    // If the email and password are incorrect, return an error response
    res.status(401).json({ error: 'Invalid email or password' });
  }
}