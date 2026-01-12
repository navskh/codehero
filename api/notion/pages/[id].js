import { notion, corsHeaders } from '../../_lib/notion.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const response = await notion.pages.retrieve({ page_id: id });
      res.json({ success: true, page: response });
    } else if (req.method === 'PATCH') {
      const response = await notion.pages.update({
        page_id: id,
        ...req.body,
      });
      res.json({ success: true, page: response });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
