import { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../stores';
import { PixelBox } from '../components/common/PixelBox';
import { getRelativeTime } from '../hooks/useNotionAll';
import { useContentAnalysis } from '../hooks/useContentAnalysis';
import { LEVEL_TABLE } from '../types';

type SortType = 'recent' | 'oldest' | 'name';

// 레벨 계산
function calculateLevel(totalXP: number) {
  let level = 1;
  for (let i = 0; i < LEVEL_TABLE.length; i++) {
    if (totalXP >= LEVEL_TABLE[i].requiredXP) {
      level = LEVEL_TABLE[i].level;
    } else {
      break;
    }
  }
  return level;
}

// 다음 레벨까지 필요한 XP
function getXPProgress(totalXP: number, level: number) {
  // 현재 레벨 도달에 필요했던 XP (레벨 1이면 0)
  const currentLevelXP = LEVEL_TABLE[level - 1]?.requiredXP || 0;
  // 다음 레벨 도달에 필요한 XP
  const nextLevelXP = LEVEL_TABLE[level]?.requiredXP || LEVEL_TABLE[LEVEL_TABLE.length - 1].requiredXP;

  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const percentage = xpNeededForLevel > 0 ? Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100) : 100;

  return {
    current: xpInCurrentLevel,
    needed: xpNeededForLevel,
    percentage,
    toNext: Math.max(0, xpNeededForLevel - xpInCurrentLevel),
  };
}

export function Home() {
  const { streak, syncFromNotion } = useGameStore();
  const {
    result,
    pages,
    isLoading,
    syncState,
    sync,
  } = useContentAnalysis();

  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Notion XP를 gameStore에 동기화
  useEffect(() => {
    if (result?.totalXP) {
      syncFromNotion(result.totalXP);
    }
  }, [result?.totalXP, syncFromNotion]);

  // XP 및 레벨 계산 (문맥 기반)
  const xpData = useMemo(() => {
    if (!result) return null;
    const totalXP = result.totalXP;
    const level = calculateLevel(totalXP);
    const progress = getXPProgress(totalXP, level);
    const levelInfo = LEVEL_TABLE[level - 1] || LEVEL_TABLE[0];

    return {
      totalXP,
      skillXP: result.skillXP,
      level,
      progress,
      title: levelInfo.title,
      stats: result.stats,
    };
  }, [result]);

  // 로딩 상태
  if (isLoading && !result) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title gradient-text mb-2">대시보드</h1>
          <p className="text-[var(--pixel-text-muted)] text-sm">오늘도 성장하는 하루를 보내세요</p>
        </div>
        <PixelBox className="p-10 text-center">
          <div className="w-10 h-10 mx-auto border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[var(--pixel-text-muted)]">
            {syncState.isSyncing
              ? `문서 분석 중... (${syncState.progress}/${syncState.total})`
              : 'Notion에서 문서를 가져오는 중...'}
          </p>
        </PixelBox>
      </div>
    );
  }

  // 검색 필터
  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 정렬
  const sortedPages = [...filteredPages].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.lastEditedTime).getTime() - new Date(a.lastEditedTime).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.lastEditedTime).getTime() - new Date(b.lastEditedTime).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  // 통계
  const todayCount = pages.filter(p => {
    const edited = new Date(p.lastEditedTime);
    const today = new Date();
    return edited.toDateString() === today.toDateString();
  }).length;

  const weekCount = pages.filter(p => {
    const edited = new Date(p.lastEditedTime);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return edited > weekAgo;
  }).length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title gradient-text mb-2">대시보드</h1>
          <p className="text-[var(--pixel-text-muted)] text-sm">
            문맥 기반 XP 시스템
            {syncState.lastSyncTime && (
              <span className="ml-2 text-[var(--pixel-text-muted)]">
                · 마지막 동기화: {getRelativeTime(syncState.lastSyncTime)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => sync()}
          disabled={syncState.isSyncing}
          className="btn-secondary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
        >
          <span className={syncState.isSyncing ? 'animate-spin' : ''}>🔄</span>
          {syncState.isSyncing
            ? `동기화 중 (${syncState.progress}/${syncState.total})`
            : '노션 동기화'}
        </button>
      </div>

      {/* 레벨 & XP 카드 */}
      {xpData && (
        <PixelBox variant="gradient" className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* 레벨 뱃지 */}
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg"
                style={{
                  background: xpData.level >= 20
                    ? 'linear-gradient(135deg, #ffd700 0%, #ff6b00 100%)'
                    : xpData.level >= 10
                    ? 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)'
                    : 'linear-gradient(135deg, #6bcb77 0%, #36a85c 100%)',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
                }}
              >
                {xpData.level}
              </div>
              <p className="text-[var(--pixel-text-muted)] text-sm mt-2">Level</p>
              <p className="gradient-text-gold font-bold text-lg">{xpData.title}</p>
            </div>

            {/* XP 정보 */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--pixel-text-muted)] text-sm">총 경험치</span>
                <span className="text-2xl font-bold text-[#a855f7]">{xpData.totalXP.toLocaleString()} XP</span>
              </div>

              {/* XP 바 */}
              <div className="xp-bar h-4 mb-2">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${xpData.progress.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--pixel-text-muted)]">
                <span>다음 레벨까지</span>
                <span>{xpData.progress.toNext.toLocaleString()} XP 필요</span>
              </div>

              {/* 스킬별 XP */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[rgba(0,212,255,0.15)] to-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] text-center">
                  <p className="text-lg font-bold text-[#0ea5e9]">{xpData.skillXP.frontend}</p>
                  <p className="text-xs text-[var(--pixel-text-muted)] font-medium">Frontend</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-[rgba(34,197,94,0.15)] to-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] text-center">
                  <p className="text-lg font-bold text-[#22c55e]">{xpData.skillXP.backend}</p>
                  <p className="text-xs text-[var(--pixel-text-muted)] font-medium">Backend</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-[rgba(168,85,247,0.15)] to-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.2)] text-center">
                  <p className="text-lg font-bold text-[#a855f7]">{xpData.skillXP.devops}</p>
                  <p className="text-xs text-[var(--pixel-text-muted)] font-medium">DevOps</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-[rgba(245,158,11,0.15)] to-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] text-center">
                  <p className="text-lg font-bold text-[#f59e0b]">{xpData.skillXP.softskills}</p>
                  <p className="text-xs text-[var(--pixel-text-muted)] font-medium">Soft Skills</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-[rgba(100,116,139,0.15)] to-[rgba(100,116,139,0.05)] border border-[rgba(100,116,139,0.2)] text-center">
                  <p className="text-lg font-bold text-[#64748b]">{xpData.skillXP.general}</p>
                  <p className="text-xs text-[var(--pixel-text-muted)] font-medium">General</p>
                </div>
              </div>
              {/* 캐시 상태 */}
              <div className="mt-3 text-xs text-[var(--pixel-text-muted)] text-right">
                분석: {xpData.stats.totalPages}개 문서 (캐시 {xpData.stats.cached}개 / 신규 {xpData.stats.analyzed}개)
              </div>
            </div>
          </div>
        </PixelBox>
      )}

      {/* 통계 카드 + 연속 출석 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#00d4ff]">{pages.length}</p>
          <p className="text-xs text-[var(--pixel-text-muted)] mt-1">전체 문서</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#6bcb77]">{todayCount}</p>
          <p className="text-xs text-[var(--pixel-text-muted)] mt-1">오늘 수정</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#a855f7]">{weekCount}</p>
          <p className="text-xs text-[var(--pixel-text-muted)] mt-1">이번 주 활동</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#ffd700]">
            {result?.pages.filter(p => p.depth === 'deep').length || 0}
          </p>
          <p className="text-xs text-[var(--pixel-text-muted)] mt-1">Deep 작업</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-orange-400">
            <span className="streak-fire">🔥</span> {streak.current}일
          </p>
          <p className="text-xs text-[var(--pixel-text-muted)] mt-1">연속 출석</p>
        </PixelBox>
      </div>

      {/* 검색 & 정렬 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="문서 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'recent', label: '최신순' },
            { id: 'oldest', label: '오래된순' },
            { id: 'name', label: '이름순' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id as SortType)}
              className={`category-tab ${sortBy === opt.id ? 'category-tab-active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 최근 수정 문서 */}
      <PixelBox className="p-5 mb-6">
        <h2 className="text-sm text-[var(--pixel-text-muted)] mb-4 flex items-center gap-2">
          <span className="text-[#00d4ff]">📝</span> 최근 수정된 문서
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedPages.slice(0, 6).map((page) => (
            <a
              key={page.id}
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-[var(--pixel-bg-secondary)] hover:bg-[rgba(14,165,233,0.1)] border border-[var(--pixel-border)] hover:border-[var(--pixel-primary)] transition-all group"
            >
              <p className="font-medium truncate group-hover:text-[var(--pixel-primary)] transition-colors">
                {page.title}
              </p>
              <p className="text-xs text-[var(--pixel-text-muted)] mt-1">
                {getRelativeTime(page.lastEditedTime)}
              </p>
            </a>
          ))}
        </div>
      </PixelBox>

      {/* 전체 문서 목록 */}
      <PixelBox className="p-5">
        <h2 className="text-sm text-[var(--pixel-text-muted)] mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-[#a855f7]">📚</span> 전체 문서
          </span>
          <span className="text-xs">{filteredPages.length}개</span>
        </h2>

        {sortedPages.length === 0 ? (
          <p className="text-center text-[var(--pixel-text-muted)] py-8">
            {searchQuery ? '검색 결과가 없습니다' : '문서가 없습니다'}
          </p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {sortedPages.map((page) => (
              <a
                key={page.id}
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--pixel-bg-secondary)] hover:bg-[rgba(14,165,233,0.08)] border border-transparent hover:border-[var(--pixel-primary)] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-lg">📄</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate group-hover:text-[var(--pixel-primary)] transition-colors">
                      {page.title}
                    </p>
                    {page.status && (
                      <span className="badge badge-primary text-xs mt-1">{page.status}</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs text-[var(--pixel-text-muted)]">
                    {getRelativeTime(page.lastEditedTime)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </PixelBox>
    </div>
  );
}
