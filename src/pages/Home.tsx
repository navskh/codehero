import { useGameStore, useAchievementStore } from '../stores';
import { PixelBox } from '../components/common/PixelBox';
import { XPBar } from '../components/gamification/XPBar';
import { LevelBadge } from '../components/gamification/LevelBadge';
import { LEVEL_TABLE } from '../types';

export function Home() {
  const { level, currentXP, totalXP, skillPoints, streak, stats, getXPToNextLevel, getCurrentLevelInfo } =
    useGameStore();
  const { getUnlockedCount, getTotalCount } = useAchievementStore();

  const levelInfo = getCurrentLevelInfo();
  const xpToNext = getXPToNextLevel();
  const achievementProgress = Math.round((getUnlockedCount() / getTotalCount()) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="mb-2">
        <h1 className="font-pixel text-2xl gradient-text mb-2">대시보드</h1>
        <p className="text-[#8888aa]">오늘도 성장하는 하루를 보내세요</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 메인 프로필 카드 */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <PixelBox variant="gradient" className="p-6">
            <div className="flex flex-col items-center">
              {/* 아바타 */}
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[rgba(0,212,255,0.2)] to-[rgba(168,85,247,0.2)] flex items-center justify-center text-6xl border border-[rgba(90,90,154,0.3)]">
                  👨‍💻
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center text-lg font-bold shadow-lg">
                  {level}
                </div>
              </div>

              {/* 레벨 & 칭호 */}
              <div className="text-center mb-4">
                <p className="text-[#8888aa] text-sm">Lv.{level}</p>
                <p className="gradient-text-gold font-bold text-lg">{levelInfo.title}</p>
              </div>

              {/* XP 바 */}
              <div className="w-full">
                <XPBar current={currentXP} max={xpToNext} showPercentage />
              </div>

              {/* 스탯 그리드 */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-[#a855f7]">{skillPoints}</p>
                  <p className="text-xs text-[#8888aa]">스킬 포인트</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-[#00d4ff]">{totalXP.toLocaleString()}</p>
                  <p className="text-xs text-[#8888aa]">총 경험치</p>
                </div>
              </div>
            </div>
          </PixelBox>

          {/* 연속 출석 */}
          <PixelBox className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(255,107,0,0.2)] to-[rgba(255,170,0,0.2)] flex items-center justify-center">
                  <span className="text-2xl streak-fire">🔥</span>
                </div>
                <div>
                  <p className="font-bold text-xl text-orange-400">{streak.current}일</p>
                  <p className="text-xs text-[#8888aa]">연속 출석</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#8888aa]">최장 기록</p>
                <p className="text-lg font-medium text-orange-300">{streak.longest}일</p>
              </div>
            </div>
          </PixelBox>
        </div>

        {/* 오른쪽 영역 */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* 퀵 스탯 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📋', value: stats.tasksCompleted, label: '완료한 태스크', color: '#00d4ff' },
              { icon: '📚', value: stats.notesCreated, label: '학습 노트', color: '#a855f7' },
              { icon: '🎯', value: stats.goalsAchieved, label: '달성한 목표', color: '#00ff88' },
              { icon: '🐛', value: stats.bugFixCount, label: '수정한 버그', color: '#ff6b6b' },
            ].map((stat) => (
              <PixelBox key={stat.label} hover className="p-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">{stat.icon}</span>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#8888aa] text-center mt-1">{stat.label}</p>
                </div>
              </PixelBox>
            ))}
          </div>

          {/* 다음 레벨까지 */}
          <PixelBox variant="glow" className="p-6">
            <h2 className="text-sm text-[#8888aa] mb-4 flex items-center gap-2">
              <span className="text-[#00d4ff]">⚡</span> 다음 레벨까지
            </h2>
            <div className="flex items-center gap-6">
              <LevelBadge level={level} size="lg" />
              <div className="flex-1">
                <XPBar current={currentXP} max={xpToNext} size="lg" showPercentage />
              </div>
              <LevelBadge level={level + 1} size="lg" />
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)]">
              <p className="text-center text-sm text-[#8888aa]">
                다음 칭호: <span className="gradient-text font-medium">{LEVEL_TABLE[level]?.title || '???'}</span>
              </p>
            </div>
          </PixelBox>

          {/* 업적 진행 */}
          <PixelBox className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm text-[#8888aa] flex items-center gap-2">
                <span className="text-[#ffd700]">🏆</span> 업적 달성률
              </h2>
              <span className="text-sm font-medium">
                <span className="text-[#00d4ff]">{getUnlockedCount()}</span>
                <span className="text-[#8888aa]"> / {getTotalCount()}</span>
              </span>
            </div>
            <div className="achievement-progress">
              <div
                className="achievement-progress-fill"
                style={{ width: `${achievementProgress}%` }}
              />
            </div>
            <p className="text-center text-sm text-[#8888aa] mt-3">
              {achievementProgress}% 달성 완료
            </p>
          </PixelBox>

          {/* 시작하기 안내 */}
          <PixelBox className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,212,255,0.05)] to-[rgba(168,85,247,0.05)]" />
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[rgba(0,212,255,0.2)] to-[rgba(168,85,247,0.2)] flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-pixel text-lg gradient-text mb-2">시작하기</h3>
              <p className="text-[#8888aa] text-sm mb-4">
                Notion과 연동하여 태스크를 가져오세요!
              </p>
              <button
                className="btn-primary px-6 py-2"
                onClick={() => window.location.href = '/settings'}
              >
                Notion 연결하기
              </button>
            </div>
          </PixelBox>
        </div>
      </div>
    </div>
  );
}
