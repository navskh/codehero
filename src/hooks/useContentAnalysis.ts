import { useCallback, useState } from 'react';
import { useNotionAll } from './useNotionAll';
import type { INotionPage } from './useNotionAll';
import { useContentStore, type IAnalysisCache } from '../stores/contentStore';
import { analyzePageFull, extractTodosFromBlocks } from '../lib/contentAnalyzer';
import type { FullPageAnalysis, SkillXP, NotionBlock } from '../lib/contentAnalyzer';
import type { ITodoItem } from '../types/task';

// API로 블록 가져오기
async function fetchBlocks(pageId: string): Promise<NotionBlock[]> {
  const res = await fetch(`/api/notion/pages/${pageId}/blocks`);
  const data = await res.json();
  if (!data.success) return [];
  return data.blocks || [];
}

// 페이지 분석 결과 (화면 표시용 - id, url, lastEditedTime 포함)
export interface PageAnalysisWithMeta extends FullPageAnalysis {
  id: string;
  url: string;
  lastEditedTime: string;
  status?: string | null;
}

// 분석 결과 인터페이스
export interface AnalysisResult {
  pages: PageAnalysisWithMeta[];
  todos: ITodoItem[];
  totalXP: number;
  skillXP: SkillXP;
  stats: {
    totalPages: number;
    cached: number;
    analyzed: number;
  };
}

// 동기화 상태
export interface SyncState {
  isSyncing: boolean;
  progress: number;
  total: number;
  lastSyncTime: string | null;
  error: string | null;
}

// 캐시에서 PageAnalysisWithMeta 변환
function cacheToPageWithMeta(cached: IAnalysisCache): PageAnalysisWithMeta {
  return {
    id: cached.pageId,
    url: cached.url || '',
    lastEditedTime: cached.lastEditedTime,
    title: cached.title,
    workType: cached.workType,
    baseXP: 0,
    depth: cached.depth,
    depthMultiplier: cached.depth === 'shallow' ? 0.5 : cached.depth === 'medium' ? 1 : 2,
    depthScore: cached.depthScore,
    finalXP: cached.finalXP,
    skillBranch: cached.skillBranch,
    skillXP: {
      frontend: cached.skillBranch === 'frontend' ? cached.finalXP : 0,
      backend: cached.skillBranch === 'backend' ? cached.finalXP : 0,
      devops: cached.skillBranch === 'devops' ? cached.finalXP : 0,
      softskills: cached.skillBranch === 'softskills' ? cached.finalXP : 0,
      general: cached.skillBranch === 'general' ? cached.finalXP : 0,
    },
  };
}

export function useContentAnalysis() {
  const { refetch: refetchNotion } = useNotionAll({ enabled: false });
  const store = useContentStore();

  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    progress: 0,
    total: 0,
    lastSyncTime: store.lastUpdated || null,
    error: null,
  });

  const [todos, setTodos] = useState<ITodoItem[]>([]);

  // 캐시에서 분석 결과 가져오기 (API 호출 없음)
  const getCachedResult = useCallback((): AnalysisResult => {
    const { cache, totalSkillXP } = store;
    const entries = Object.values(cache);

    const pages = entries.map(cacheToPageWithMeta);
    const totalXP = entries.reduce((sum, e) => sum + e.finalXP, 0);

    return {
      pages,
      todos: [], // 캐시에서는 할일 없음 (동기화 시에만 추출)
      totalXP,
      skillXP: totalSkillXP,
      stats: {
        totalPages: entries.length,
        cached: entries.length,
        analyzed: 0,
      },
    };
  }, [store]);

  // 페이지 분석 함수 (동기화 버튼 누를 때만 호출)
  const analyzePages = useCallback(async (pages: INotionPage[]) => {
    setSyncState(prev => ({
      ...prev,
      isSyncing: true,
      progress: 0,
      total: pages.length,
      error: null,
    }));

    const results: PageAnalysisWithMeta[] = [];
    const allTodos: ITodoItem[] = [];
    let cached = 0;
    let analyzed = 0;

    const totals: SkillXP = {
      frontend: 0,
      backend: 0,
      devops: 0,
      softskills: 0,
      general: 0,
    };

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      try {
        // 블록 가져오기 (할일 추출을 위해)
        const blocks = await fetchBlocks(page.id);

        // 할일 추출
        const pageTodos = extractTodosFromBlocks(blocks, page.id, page.title, page.url);
        allTodos.push(...pageTodos);

        // 캐시 확인 (XP 분석용)
        const cachedResult = store.getCachedAnalysis(page.id, page.lastEditedTime);

        if (cachedResult) {
          cached++;
          const pageWithMeta = cacheToPageWithMeta(cachedResult);
          // 최신 URL 업데이트
          pageWithMeta.url = page.url;
          pageWithMeta.status = page.status;
          results.push(pageWithMeta);
          totals[cachedResult.skillBranch] += cachedResult.finalXP;
        } else {
          analyzed++;
          const analysis = analyzePageFull(page.title, blocks);
          store.saveAnalysis(page.id, page.url, page.lastEditedTime, analysis);

          const pageWithMeta: PageAnalysisWithMeta = {
            ...analysis,
            id: page.id,
            url: page.url,
            lastEditedTime: page.lastEditedTime,
            status: page.status,
          };
          results.push(pageWithMeta);
          totals[analysis.skillBranch] += analysis.finalXP;
        }
      } catch (err) {
        console.error(`Failed to analyze page: ${page.title}`, err);
      }

      setSyncState(prev => ({ ...prev, progress: i + 1 }));
    }

    // 할일 상태 업데이트
    setTodos(allTodos);

    setSyncState(prev => ({
      ...prev,
      isSyncing: false,
      lastSyncTime: new Date().toISOString(),
    }));

    return {
      pages: results,
      todos: allTodos,
      totalXP: results.reduce((sum, r) => sum + r.finalXP, 0),
      skillXP: totals,
      stats: {
        totalPages: pages.length,
        cached,
        analyzed,
      },
    };
  }, [store]);

  // 수동 동기화 (버튼 클릭 시에만 호출)
  const sync = useCallback(async () => {
    setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      // Notion API 호출
      const { data } = await refetchNotion();
      if (data?.pages) {
        await analyzePages(data.pages);
      } else {
        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          error: 'Notion 데이터를 가져올 수 없습니다.',
        }));
      }
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: '동기화 중 오류가 발생했습니다.',
      }));
    }
  }, [refetchNotion, analyzePages]);

  // 캐시 클리어
  const clearCache = useCallback(() => {
    store.clearCache();
    setTodos([]);
  }, [store]);

  // 캐시된 결과
  const cachedResult = getCachedResult();

  return {
    // 데이터 (캐시 기반)
    result: cachedResult,
    pages: cachedResult.pages,
    todos,

    // 상태
    isLoading: syncState.isSyncing,
    syncState,

    // 액션
    sync,
    clearCache,

    // 캐시 통계
    cacheStats: store.getCacheStats(),
  };
}
