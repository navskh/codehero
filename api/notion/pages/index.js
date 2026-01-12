import { notion, corsHeaders } from '../../_lib/notion.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const response = await notion.pages.create(req.body);
    res.json({ success: true, page: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
