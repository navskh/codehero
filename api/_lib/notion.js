import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.VITE_NOTION_TOKEN,
});

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
