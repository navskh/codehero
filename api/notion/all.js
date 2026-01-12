import { notion, corsHeaders } from '../_lib/notion.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    let allResults = [];
    let cursor = undefined;

    do {
      const response = await notion.search({
        start_cursor: cursor,
        page_size: 100,
      });
      allResults = allResults.concat(response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);

    const pages = allResults.filter(r => r.object === 'page');
    const databases = allResults.filter(r => r.object === 'database');

    const processedPages = pages.map(page => {
      const props = page.properties || {};

      let title = '제목 없음';
      for (const [key, value] of Object.entries(props)) {
        if (value.type === 'title' && value.title?.length > 0) {
          title = value.title.map(t => t.plain_text).join('');
          break;
        }
      }

      let status = null;
      const statusKeys = ['Status', 'status', '상태'];
      for (const key of statusKeys) {
        if (props[key]?.select?.name) {
          status = props[key].select.name;
          break;
        }
        if (props[key]?.status?.name) {
          status = props[key].status.name;
          break;
        }
      }

      return {
        id: page.id,
        title,
        status,
        url: page.url,
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };
    });

    const processedDatabases = databases.map(db => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || '제목 없음',
      url: db.url,
    }));

    res.json({
      success: true,
      total: allResults.length,
      pages: processedPages,
      databases: processedDatabases,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
