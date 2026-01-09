import { useState } from 'react';
import { PixelBox } from '../components/common/PixelBox';
import { useAchievementStore } from '../stores';
import type { AchievementCategory } from '../types';

const categoryFilters: { id: AchievementCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: '전체', icon: '📋' },
  { id: 'tasks', label: '태스크', icon: '✅' },
  { id: 'learning', label: '학습', icon: '📚' },
  { id: 'streak', label: '출석', icon: '🔥' },
  { id: 'milestone', label: '마일스톤', icon: '🏅' },
  { id: 'special', label: '특별', icon: '⭐' },
];

export function Achievements() {
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all');
  const { achievements, getUnlockedCount, getTotalCount } = useAchievementStore();

  const filteredAchievements = achievements.filter((a) => {
    if (a.isHidden && !a.unlockedAt) return false;
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const unlockedCount = getUnlockedCount();
  const totalCount = getTotalCount();
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-pixel text-2xl gradient-text-gold mb-2">업적</h1>
          <p className="text-[#8888aa] text-sm">목표를 달성하고 보상을 획득하세요</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-xl">
          <span className="text-[#ffd700] font-bold">{unlockedCount}</span>
          <span className="text-[#8888aa]"> / {totalCount} 달성</span>
        </div>
      </div>

      {/* 진행률 */}
      <PixelBox variant="glow" className="p-5 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[rgba(255,215,0,0.2)] to-[rgba(255,170,0,0.2)] flex items-center justify-center">
            <span className="text-4xl">🏆</span>
          </div>
          <div className="flex-1">
            <div className="achievement-progress">
              <div
                className="achievement-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-[#8888aa]">{progressPercent}% 달성</p>
              <p className="text-sm text-[#ffd700]">{totalCount - unlockedCount}개 남음</p>
            </div>
          </div>
        </div>
      </PixelBox>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categoryFilters.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`category-tab ${filter === cat.id ? 'category-tab-active' : ''}`}
          >
            <span>{cat.icon}</span>
            <span className="text-sm">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 업적 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          const progress = (achievement.condition.current / achievement.condition.target) * 100;

          return (
            <PixelBox
              key={achievement.id}
              className={`p-5 ${!isUnlocked ? 'opacity-80' : ''}`}
              hover
            >
              <div className="flex gap-4">
                {/* 아이콘 */}
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                    isUnlocked ? `achievement-${achievement.rarity}` : 'bg-[rgba(0,0,0,0.3)]'
                  }`}
                >
                  {achievement.icon}
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold truncate">{achievement.name}</h3>
                    {isUnlocked && (
                      <span className="w-6 h-6 rounded-full bg-[#6bcb77] flex items-center justify-center flex-shrink-0">
                        <span className="text-black text-xs">✓</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#8888aa] mt-1 line-clamp-2">{achievement.description}</p>

                  {/* 진행률 */}
                  {!isUnlocked && (
                    <div className="mt-3">
                      <div className="xp-bar h-2">
                        <div
                          className="xp-bar-fill"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#8888aa] mt-1">
                        {achievement.condition.current} / {achievement.condition.target}
                      </p>
                    </div>
                  )}

                  {/* 보상 */}
                  <div className="flex items-center gap-3 mt-3">
                    {achievement.reward.xp > 0 && (
                      <span className="badge badge-primary">+{achievement.reward.xp} XP</span>
                    )}
                    {achievement.reward.skillPoints && (
                      <span className="badge badge-warning">+{achievement.reward.skillPoints} SP</span>
                    )}
                    {achievement.reward.itemUnlock && (
                      <span className="text-[#a855f7]">🎁</span>
                    )}
                    {achievement.reward.title && (
                      <span className="text-xs text-[#8888aa]">"{achievement.reward.title}"</span>
                    )}
                  </div>

                  {/* 달성 시간 */}
                  {isUnlocked && achievement.unlockedAt && (
                    <p className="text-xs text-[#666688] mt-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString()} 달성
                    </p>
                  )}
                </div>
              </div>
            </PixelBox>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <PixelBox className="p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[rgba(255,215,0,0.1)] flex items-center justify-center">
            <span className="text-4xl">🏆</span>
          </div>
          <p className="text-[#8888aa]">이 카테고리에 업적이 없습니다</p>
        </PixelBox>
      )}
    </div>
  );
}
