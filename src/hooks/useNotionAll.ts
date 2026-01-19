import { useQuery } from '@tanstack/react-query';

export interface INotionPage {
  id: string;
  title: string;
  status: string | null;
  url: string;
  createdTime: string;
  lastEditedTime: string;
}

export interface INotionDatabase {
  id: string;
  title: string;
  url: string;
}

interface INotionAllResponse {
  success: boolean;
  total: number;
  pages: INotionPage[];
  databases: INotionDatabase[];
}

async function fetchNotionAll(): Promise<INotionAllResponse> {
  const res = await fetch('/api/notion/all');
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
}

export function useNotionAll(options?: { enabled?: boolean }) {
  const { enabled = false } = options || {};

  return useQuery({
    queryKey: ['notion-all'],
    queryFn: fetchNotionAll,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
    enabled, // 기본 false - 동기화 버튼 누를 때만 fetch
  });
}

// 유틸: 상대 시간 표시
export function getRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}
