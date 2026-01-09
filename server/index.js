import express from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.VITE_NOTION_TOKEN,
});

// 연결 테스트
app.get('/api/notion/test', async (req, res) => {
  try {
    const response = await notion.users.me({});
    res.json({ success: true, user: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 전체 페이지 검색 (페이지네이션 포함)
app.get('/api/notion/all', async (req, res) => {
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
      console.log(`Fetched ${allResults.length} items...`);
    } while (cursor);

    // 페이지와 데이터베이스 분리
    const pages = allResults.filter(r => r.object === 'page');
    const databases = allResults.filter(r => r.object === 'database');

    // 페이지 정보 추출
    const processedPages = pages.map(page => {
      const props = page.properties || {};

      // 제목 찾기
      let title = '제목 없음';
      for (const [key, value] of Object.entries(props)) {
        if (value.type === 'title' && value.title?.length > 0) {
          title = value.title.map(t => t.plain_text).join('');
          break;
        }
      }

      // 상태 찾기
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

    // 데이터베이스 정보 추출
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
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 데이터베이스 목록 조회
app.get('/api/notion/databases', async (req, res) => {
  try {
    const response = await notion.search({
      filter: { property: 'object', value: 'data_source' },
    });
    // 데이터베이스만 필터링
    const databases = response.results.filter(r => r.object === 'database');
    res.json({ success: true, databases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 특정 데이터베이스 조회
app.get('/api/notion/databases/:id', async (req, res) => {
  try {
    const response = await notion.databases.retrieve({
      database_id: req.params.id,
    });
    res.json({ success: true, database: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 데이터베이스 쿼리 (태스크 목록 등)
app.post('/api/notion/databases/:id/query', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: req.params.id,
      ...req.body,
    });
    res.json({ success: true, results: response.results, hasMore: response.has_more, nextCursor: response.next_cursor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 페이지 생성 (새 태스크 등)
app.post('/api/notion/pages', async (req, res) => {
  try {
    const response = await notion.pages.create(req.body);
    res.json({ success: true, page: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 페이지 업데이트 (태스크 상태 변경 등)
app.patch('/api/notion/pages/:id', async (req, res) => {
  try {
    const response = await notion.pages.update({
      page_id: req.params.id,
      ...req.body,
    });
    res.json({ success: true, page: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 페이지 조회
app.get('/api/notion/pages/:id', async (req, res) => {
  try {
    const response = await notion.pages.retrieve({
      page_id: req.params.id,
    });
    res.json({ success: true, page: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 페이지 블록 조회 (콘텐츠 분석용)
app.get('/api/notion/pages/:id/blocks', async (req, res) => {
  try {
    let allBlocks = [];
    let cursor = undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: req.params.id,
        start_cursor: cursor,
        page_size: 100,
      });
      allBlocks = allBlocks.concat(response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);

    res.json({ success: true, blocks: allBlocks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Notion API 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
