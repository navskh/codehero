import { useQuery } from '@tanstack/react-query';
import { testConnection, getDatabases, type INotionDatabase } from '../api/notion';

// Notion 연결 테스트 훅
export function useNotionConnection() {
  return useQuery({
    queryKey: ['notion-connection'],
    queryFn: testConnection,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// Notion 데이터베이스 목록 훅
export function useNotionDatabases() {
  return useQuery({
    queryKey: ['notion-databases'],
    queryFn: getDatabases,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 데이터베이스 이름 추출 헬퍼
export function getDatabaseTitle(db: INotionDatabase): string {
  return db.title?.[0]?.plain_text || '이름 없음';
}
