import { useEffect, useState } from 'react';
import { useAchievementStore } from '../../stores';
import { ACHIEVEMENT_RARITY_COLORS } from '../../types';
import { PixelBox } from '../common/PixelBox';

export function AchievementPopup() {
  const { recentUnlock, clearRecentUnlock } = useAchievementStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (recentUnlock) {
      setIsVisible(true);

      // 5초 후 자동으로 닫기
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(clearRecentUnlock, 500); // 애니메이션 후 클리어
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [recentUnlock, clearRecentUnlock]);

  if (!recentUnlock) return null;

  const rarityColor = ACHIEVEMENT_RARITY_COLORS[recentUnlock.rarity];

  return (
    <div
      className={`achievement-popup transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <PixelBox className="p-4 min-w-[300px]">
        <div className="flex items-start gap-4">
          {/* 아이콘 */}
          <div
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl achievement-${recentUnlock.rarity}`}
          >
            {recentUnlock.icon}
          </div>

          {/* 내용 */}
          <div className="flex-1">
            <p className="text-xs text-pixel-accent mb-1">업적 달성!</p>
            <h3 className="font-bold text-lg">{recentUnlock.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{recentUnlock.description}</p>

            {/* 보상 */}
            <div className="flex items-center gap-3 mt-3 text-sm">
              {recentUnlock.reward.xp > 0 && (
                <span className="text-pixel-xp">+{recentUnlock.reward.xp} XP</span>
              )}
              {recentUnlock.reward.skillPoints && (
                <span className="text-pixel-accent">+{recentUnlock.reward.skillPoints} SP</span>
              )}
              {recentUnlock.reward.itemUnlock && (
                <span className="text-pixel-primary">🎁 아이템 해금</span>
              )}
            </div>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(clearRecentUnlock, 500);
            }}
            className="text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      </PixelBox>
    </div>
  );
}
