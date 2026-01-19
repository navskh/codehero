import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameStore, useContentStore, useLayeredAvatarStore } from '../../stores';
import { LayeredAvatar } from '../avatar';

interface IMainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: '홈', icon: '🏠' },
  { path: '/tasks', label: '태스크', icon: '📋' },
  { path: '/avatar', label: '아바타', icon: '👤' },
];

export function MainLayout({ children }: IMainLayoutProps) {
  const location = useLocation();
  const { level, currentXP, streak, syncFromNotion } = useGameStore();
  const { getCurrentLevelInfo, getXPToNextLevel, checkAndUpdateStreak, isCheckedInToday } = useGameStore();
  const { getCacheStats } = useContentStore();
  const { config: avatarConfig } = useLayeredAvatarStore();

  const [checkInAnimation, setCheckInAnimation] = useState(false);
  const [checkInBonusXP, setCheckInBonusXP] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 페이지 이동시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleCheckIn = () => {
    const result = checkAndUpdateStreak();
    if (result.isNewCheckIn) {
      setCheckInBonusXP(result.bonusXP);
      setCheckInAnimation(true);
      setTimeout(() => setCheckInAnimation(false), 2000);
    }
  };

  // 캐시된 XP로 레벨 동기화
  useEffect(() => {
    const stats = getCacheStats();
    if (stats.totalXP > 0) {
      syncFromNotion(stats.totalXP);
    }
  }, [getCacheStats, syncFromNotion]);

  const levelInfo = getCurrentLevelInfo();
  const xpToNext = getXPToNextLevel();
  const xpPercentage = xpToNext > 0 ? (currentXP / xpToNext) * 100 : 100;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* 모바일 헤더 */}
      <header className="lg:hidden glass-card m-3 mb-0 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center text-xl">
            ⚔️
          </div>
          <h1 className="font-pixel text-sm gradient-text">
            CodeHero
          </h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.1)] flex items-center justify-center text-xl hover:bg-[rgba(14,165,233,0.2)] transition-colors"
          aria-label="메뉴 열기"
        >
          ☰
        </button>
      </header>

      {/* 모바일 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside className={`
        w-72 glass-card border-r border-[rgba(203,213,225,0.5)] flex flex-col rounded-2xl overflow-hidden
        fixed lg:relative inset-y-0 left-0 z-50 m-0 lg:m-3 lg:mr-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* 로고 영역 */}
        <div className="p-6 border-b border-[rgba(203,213,225,0.5)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center text-xl">
                ⚔️
              </div>
              <h1 className="font-pixel text-lg gradient-text">
                CodeHero
              </h1>
            </div>
            {/* 모바일 닫기 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg bg-[rgba(100,116,139,0.1)] flex items-center justify-center text-[#64748b] hover:bg-[rgba(100,116,139,0.2)] transition-colors"
              aria-label="메뉴 닫기"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 프로필 섹션 */}
        <div className="p-5 border-b border-[rgba(203,213,225,0.5)]">
          {/* 픽셀 아바타 */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[rgba(14,165,233,0.1)] to-[rgba(139,92,246,0.1)] border border-[rgba(203,213,225,0.5)] flex items-center justify-center overflow-hidden">
                <LayeredAvatar config={avatarConfig} size={80} animated={false} />
              </div>
              <div className="absolute -bottom-1 -right-1 level-badge text-sm font-bold w-8 h-8 flex items-center justify-center">
                {level}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-center">
              <p className="text-sm text-[#64748b]">Lv.{level}</p>
              <p className="text-sm font-medium gradient-text-gold truncate">{levelInfo.title}</p>
            </div>
          </div>

          {/* XP 바 */}
          <div className="space-y-2">
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{ width: `${Math.min(xpPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#64748b]">
              <span>EXP</span>
              <span className="font-medium">{currentXP.toLocaleString()} / {xpToNext.toLocaleString()}</span>
            </div>
          </div>

          {/* 연속 출석 */}
          <div className="mt-4 p-3 rounded-lg bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl streak-fire">🔥</span>
                <div>
                  <p className="text-xs text-[#64748b]">연속 출석</p>
                  <p className="font-bold text-orange-400">{streak.current}일</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748b]">최장</p>
                <p className="text-sm text-orange-300">{streak.longest}일</p>
              </div>
            </div>

            {/* 출석 체크 버튼 */}
            <div className="mt-3 pt-3 border-t border-[rgba(255,107,0,0.2)]">
              {isCheckedInToday() ? (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-green-400">
                  <span>✓</span>
                  <span>오늘 출석 완료!</span>
                </div>
              ) : (
                <button
                  onClick={handleCheckIn}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  출석 체크하기
                </button>
              )}
              {checkInAnimation && (
                <div className="mt-2 text-center animate-bounce">
                  <span className="text-green-400 font-bold">+{checkInBonusXP} XP</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                >
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* 설정 */}
        <div className="p-3 border-t border-[rgba(203,213,225,0.5)]">
          <Link
            to="/settings"
            className={`nav-item ${location.pathname === '/settings' ? 'nav-item-active' : ''}`}
          >
            <span className="text-xl w-8 text-center">⚙️</span>
            <span className="font-medium">설정</span>
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto p-3">
        <div className="glass-card min-h-full rounded-2xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
