import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameStore } from '../../stores';

interface IMainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: '홈', icon: '🏠' },
  { path: '/tasks', label: '태스크', icon: '📋' },
  { path: '/notes', label: '학습', icon: '📚' },
  { path: '/goals', label: '목표', icon: '🎯' },
  { path: '/avatar', label: '아바타', icon: '👤' },
  { path: '/skills', label: '스킬', icon: '🌳' },
  { path: '/achievements', label: '업적', icon: '🏆' },
];

export function MainLayout({ children }: IMainLayoutProps) {
  const location = useLocation();
  const { level, currentXP, streak } = useGameStore();
  const { getCurrentLevelInfo, getXPToNextLevel } = useGameStore();

  const levelInfo = getCurrentLevelInfo();
  const xpToNext = getXPToNextLevel();
  const xpPercentage = xpToNext > 0 ? (currentXP / xpToNext) * 100 : 100;

  return (
    <div className="min-h-screen flex">
      {/* 사이드바 */}
      <aside className="w-72 glass-card border-r border-[rgba(90,90,154,0.3)] flex flex-col m-3 mr-0 rounded-2xl overflow-hidden">
        {/* 로고 영역 */}
        <div className="p-6 border-b border-[rgba(90,90,154,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center text-xl">
              ⚔️
            </div>
            <h1 className="font-pixel text-lg gradient-text">
              CodeHero
            </h1>
          </div>
        </div>

        {/* 프로필 섹션 */}
        <div className="p-5 border-b border-[rgba(90,90,154,0.2)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="level-badge text-lg font-bold">
              {level}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#8888aa]">Lv.{level}</p>
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
            <div className="flex justify-between text-xs text-[#8888aa]">
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
                  <p className="text-xs text-[#8888aa]">연속 출석</p>
                  <p className="font-bold text-orange-400">{streak.current}일</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#8888aa]">최장</p>
                <p className="text-sm text-orange-300">{streak.longest}일</p>
              </div>
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
        <div className="p-3 border-t border-[rgba(90,90,154,0.2)]">
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
