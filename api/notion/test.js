import { notion, corsHeaders } from '../_lib/notion.js';

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const response = await notion.users.me({});
    res.json({ success: true, user: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
