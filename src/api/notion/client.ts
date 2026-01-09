// Notion API 클라이언트 (프록시 서버 통해 호출)

const API_BASE = '/api/notion';

interface IApiResponse<T> {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'API 호출 실패');
  }

  return data;
}

// 연결 테스트
export async function testConnection() {
  return apiCall<{ success: boolean; user: unknown }>('/test');
}

// 데이터베이스 목록 조회
export async function getDatabases() {
  return apiCall<{ success: boolean; databases: INotionDatabase[] }>('/databases');
}

// 데이터베이스 상세 조회
export async function getDatabase(databaseId: string) {
  return apiCall<{ success: boolean; database: INotionDatabase }>(`/databases/${databaseId}`);
}

// 데이터베이스 쿼리
export async function queryDatabase(databaseId: string, query?: IQueryOptions) {
  return apiCall<{ success: boolean; results: INotionPage[]; hasMore: boolean; nextCursor: string | null }>(
    `/databases/${databaseId}/query`,
    {
      method: 'POST',
      body: JSON.stringify(query || {}),
    }
  );
}

// 페이지 생성
export async function createPage(data: ICreatePageData) {
  return apiCall<{ success: boolean; page: INotionPage }>('/pages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 페이지 업데이트
export async function updatePage(pageId: string, properties: Record<string, unknown>) {
  return apiCall<{ success: boolean; page: INotionPage }>(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  });
}

// 페이지 조회
export async function getPage(pageId: string) {
  return apiCall<{ success: boolean; page: INotionPage }>(`/pages/${pageId}`);
}

// 타입 정의
export interface INotionDatabase {
  id: string;
  title: Array<{ plain_text: string }>;
  properties: Record<string, IPropertyConfig>;
  created_time: string;
  last_edited_time: string;
}

export interface IPropertyConfig {
  id: string;
  name: string;
  type: string;
  [key: string]: unknown;
}

export interface INotionPage {
  id: string;
  properties: Record<string, IPropertyValue>;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
}

export interface IPropertyValue {
  id: string;
  type: string;
  [key: string]: unknown;
}

export interface IQueryOptions {
  filter?: Record<string, unknown>;
  sorts?: Array<{ property: string; direction: 'ascending' | 'descending' }>;
  start_cursor?: string;
  page_size?: number;
}

export interface ICreatePageData {
  parent: { database_id: string };
  properties: Record<string, unknown>;
}
