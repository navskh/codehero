import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WorkType,
  ContentDepth,
  SkillBranch,
  SkillXP,
  FullPageAnalysis,
} from '../lib/contentAnalyzer';
import { analyzePageFull } from '../lib/contentAnalyzer';

// 캐시 항목 인터페이스
export interface IAnalysisCache {
  pageId: string;
  title: string;
  lastAnalyzed: string;      // 분석 시점
  lastEditedTime: string;    // 페이지 수정 시점
  workType: WorkType;
  depth: ContentDepth;
  depthScore: number;
  skillBranch: SkillBranch;
  finalXP: number;
}

// 스토어 상태 인터페이스
interface IContentState {
  cache: Record<string, IAnalysisCache>;  // pageId → cache
  totalSkillXP: SkillXP;
  lastUpdated: string;
}

// 스토어 액션 인터페이스
interface IContentStore extends IContentState {
  // 캐시 조회 (수정일 비교)
  getCachedAnalysis: (pageId: string, lastEditedTime: string) => IAnalysisCache | null;

  // 분석 결과 저장
  saveAnalysis: (pageId: string, lastEditedTime: string, analysis: FullPageAnalysis) => void;

  // 전체 스킬 XP 재계산
  recalculateTotalSkillXP: () => SkillXP;

  // 캐시 클리어
  clearCache: () => void;

  // 특정 페이지 캐시 삭제
  invalidateCache: (pageId: string) => void;

  // 캐시 통계
  getCacheStats: () => { totalPages: number; totalXP: number; bySkill: SkillXP };
}

const initialState: IContentState = {
  cache: {},
  totalSkillXP: {
    frontend: 0,
    backend: 0,
    devops: 0,
    softskills: 0,
    general: 0,
  },
  lastUpdated: '',
};

export const useContentStore = create<IContentStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      getCachedAnalysis: (pageId, lastEditedTime) => {
        const { cache } = get();
        const cached = cache[pageId];

        if (!cached) return null;

        // 페이지가 수정되었으면 캐시 무효화
        if (new Date(lastEditedTime) > new Date(cached.lastAnalyzed)) {
          return null;
        }

        return cached;
      },

      saveAnalysis: (pageId, lastEditedTime, analysis) => {
        const cacheEntry: IAnalysisCache = {
          pageId,
          title: analysis.title,
          lastAnalyzed: new Date().toISOString(),
          lastEditedTime,
          workType: analysis.workType,
          depth: analysis.depth,
          depthScore: analysis.depthScore,
          skillBranch: analysis.skillBranch,
          finalXP: analysis.finalXP,
        };

        set((state) => ({
          cache: {
            ...state.cache,
            [pageId]: cacheEntry,
          },
          lastUpdated: new Date().toISOString(),
        }));

        // 전체 스킬 XP 재계산
        get().recalculateTotalSkillXP();
      },

      recalculateTotalSkillXP: () => {
        const { cache } = get();
        const totals: SkillXP = {
          frontend: 0,
          backend: 0,
          devops: 0,
          softskills: 0,
          general: 0,
        };

        Object.values(cache).forEach((entry) => {
          totals[entry.skillBranch] += entry.finalXP;
        });

        set({ totalSkillXP: totals });
        return totals;
      },

      clearCache: () => {
        set(initialState);
      },

      invalidateCache: (pageId) => {
        set((state) => {
          const newCache = { ...state.cache };
          delete newCache[pageId];
          return { cache: newCache };
        });
        get().recalculateTotalSkillXP();
      },

      getCacheStats: () => {
        const { cache, totalSkillXP } = get();
        const entries = Object.values(cache);
        const totalXP = entries.reduce((sum, e) => sum + e.finalXP, 0);

        return {
          totalPages: entries.length,
          totalXP,
          bySkill: totalSkillXP,
        };
      },
    }),
    {
      name: 'codehero-content-cache',
    }
  )
);

// ============================================
// 헬퍼 함수: 페이지 분석 (캐시 활용)
// ============================================

export interface NotionPageInfo {
  id: string;
  title: string;
  lastEditedTime: string;
}

export interface NotionBlock {
  type: string;
  [key: string]: unknown;
}

// 단일 페이지 분석 (캐시 우선)
export async function analyzePageWithCache(
  page: NotionPageInfo,
  fetchBlocks: (pageId: string) => Promise<NotionBlock[]>
): Promise<FullPageAnalysis> {
  const store = useContentStore.getState();

  // 1. 캐시 확인
  const cached = store.getCachedAnalysis(page.id, page.lastEditedTime);
  if (cached) {
    // 캐시된 데이터로 FullPageAnalysis 구성
    return {
      title: cached.title,
      workType: cached.workType,
      baseXP: 0, // 캐시에서는 생략
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

  // 2. 캐시 미스 → 블록 가져와서 분석
  const blocks = await fetchBlocks(page.id);
  const analysis = analyzePageFull(page.title, blocks);

  // 3. 결과 캐시에 저장
  store.saveAnalysis(page.id, page.lastEditedTime, analysis);

  return analysis;
}

// 여러 페이지 일괄 분석
export async function analyzeAllPages(
  pages: NotionPageInfo[],
  fetchBlocks: (pageId: string) => Promise<NotionBlock[]>,
  onProgress?: (current: number, total: number) => void
): Promise<{
  results: FullPageAnalysis[];
  stats: { cached: number; analyzed: number };
}> {
  const store = useContentStore.getState();
  const results: FullPageAnalysis[] = [];
  let cached = 0;
  let analyzed = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // 캐시 확인
    const cachedResult = store.getCachedAnalysis(page.id, page.lastEditedTime);

    if (cachedResult) {
      cached++;
      results.push({
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
      });
    } else {
      analyzed++;
      const blocks = await fetchBlocks(page.id);
      const analysis = analyzePageFull(page.title, blocks);
      store.saveAnalysis(page.id, page.lastEditedTime, analysis);
      results.push(analysis);
    }

    onProgress?.(i + 1, pages.length);
  }

  return { results, stats: { cached, analyzed } };
}
