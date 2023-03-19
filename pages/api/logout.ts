import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  // Clear the "session" cookie by setting its expiration to a past time
  res.setHeader('Set-Cookie', 'IOsession=; HttpOnly; SameSite=Strict ; Path=/ ; Max-Age=0 ; secure=true Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  // Return a success response
  res.status(200).json({ success: true });
}