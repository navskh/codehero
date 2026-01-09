import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotionAll } from './useNotionAll';
import type { INotionPage } from './useNotionAll';
import { useContentStore } from '../stores/contentStore';
import { analyzePageFull } from '../lib/contentAnalyzer';
import type { FullPageAnalysis, SkillXP, NotionBlock } from '../lib/contentAnalyzer';

// API로 블록 가져오기
async function fetchBlocks(pageId: string): Promise<NotionBlock[]> {
  const res = await fetch(`/api/notion/pages/${pageId}/blocks`);
  const data = await res.json();
  if (!data.success) return [];
  return data.blocks || [];
}

// 분석 결과 인터페이스
export interface AnalysisResult {
  pages: FullPageAnalysis[];
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

export function useContentAnalysis(options?: {
  autoSync?: boolean;         // 자동 동기화 활성화
  pollingInterval?: number;   // 폴링 간격 (ms), 기본 5분
}) {
  const { autoSync = true, pollingInterval = 5 * 60 * 1000 } = options || {};

  const { data: notionData, isLoading: isLoadingNotion, refetch: refetchNotion } = useNotionAll();
  const store = useContentStore();

  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    progress: 0,
    total: 0,
    lastSyncTime: null,
    error: null,
  });

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 페이지 분석 함수
  const analyzePages = useCallback(async (pages: INotionPage[]) => {
    setSyncState(prev => ({
      ...prev,
      isSyncing: true,
      progress: 0,
      total: pages.length,
      error: null,
    }));

    const results: FullPageAnalysis[] = [];
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
        // 캐시 확인
        const cachedResult = store.getCachedAnalysis(page.id, page.lastEditedTime);

        if (cachedResult) {
          cached++;
          const analysis: FullPageAnalysis = {
            title: cachedResult.title,
            workType: cachedResult.workType,
            baseXP: 0,
            depth: cachedResult.depth,
            depthMultiplier: cachedResult.depth === 'shallow' ? 0.5 : cachedResult.depth === 'medium' ? 1 : 2,
            depthScore: cachedResult.depthScore,
            finalXP: cachedResult.finalXP,
            skillBranch: cachedResult.skillBranch,
            skillXP: {
              frontend: cachedResult.skillBranch === 'frontend' ? cachedResult.finalXP : 0,
              backend: cachedResult.skillBranch === 'backend' ? cachedResult.finalXP : 0,
              devops: cachedResult.skillBranch === 'devops' ? cachedResult.finalXP : 0,
              softskills: cachedResult.skillBranch === 'softskills' ? cachedResult.finalXP : 0,
              general: cachedResult.skillBranch === 'general' ? cachedResult.finalXP : 0,
            },
          };
          results.push(analysis);
          totals[cachedResult.skillBranch] += cachedResult.finalXP;
        } else {
          analyzed++;
          const blocks = await fetchBlocks(page.id);
          const analysis = analyzePageFull(page.title, blocks);
          store.saveAnalysis(page.id, page.lastEditedTime, analysis);
          results.push(analysis);
          totals[analysis.skillBranch] += analysis.finalXP;
        }
      } catch (err) {
        console.error(`Failed to analyze page: ${page.title}`, err);
      }

      setSyncState(prev => ({ ...prev, progress: i + 1 }));
    }

    const totalXP = results.reduce((sum, r) => sum + r.finalXP, 0);

    const result: AnalysisResult = {
      pages: results,
      totalXP,
      skillXP: totals,
      stats: {
        totalPages: pages.length,
        cached,
        analyzed,
      },
    };

    setAnalysisResult(result);
    setSyncState(prev => ({
      ...prev,
      isSyncing: false,
      lastSyncTime: new Date().toISOString(),
    }));

    return result;
  }, [store]);

  // 수동 동기화
  const sync = useCallback(async () => {
    // 먼저 Notion 데이터 새로고침
    const { data } = await refetchNotion();
    if (data?.pages) {
      await analyzePages(data.pages);
    }
  }, [refetchNotion, analyzePages]);

  // 초기 로드 시 분석
  useEffect(() => {
    if (notionData?.pages && !analysisResult && !syncState.isSyncing) {
      analyzePages(notionData.pages);
    }
  }, [notionData, analysisResult, syncState.isSyncing, analyzePages]);

  // 자동 폴링
  useEffect(() => {
    if (!autoSync) return;

    pollingRef.current = setInterval(() => {
      console.log('[ContentAnalysis] Auto-sync triggered');
      sync();
    }, pollingInterval);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [autoSync, pollingInterval, sync]);

  // 캐시 클리어
  const clearCache = useCallback(() => {
    store.clearCache();
    setAnalysisResult(null);
  }, [store]);

  return {
    // 데이터
    result: analysisResult,
    pages: notionData?.pages || [],

    // 상태
    isLoading: isLoadingNotion || syncState.isSyncing,
    syncState,

    // 액션
    sync,
    clearCache,

    // 캐시 통계
    cacheStats: store.getCacheStats(),
  };
}
