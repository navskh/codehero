import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IAchievement, AchievementCategory } from '../types';
import { DEFAULT_ACHIEVEMENTS } from '../types';
import { useGameStore } from './gameStore';
import { useAvatarStore } from './avatarStore';

interface IAchievementStore {
  achievements: IAchievement[];
  recentUnlock: IAchievement | null;

  // Actions
  checkAchievement: (type: string, current: number) => IAchievement[];
  unlockAchievement: (achievementId: string) => void;
  getProgress: (achievementId: string) => { current: number; target: number; percentage: number };
  getUnlockedCount: () => number;
  getTotalCount: () => number;
  getByCategory: (category: AchievementCategory) => IAchievement[];
  clearRecentUnlock: () => void;
  reset: () => void;
}

export const useAchievementStore = create<IAchievementStore>()(
  persist(
    (set, get) => ({
      achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
      recentUnlock: null,

      checkAchievement: (type, current) => {
        const state = get();
        const unlocked: IAchievement[] = [];

        const updatedAchievements = state.achievements.map((achievement) => {
          // 이미 달성된 업적은 스킵
          if (achievement.unlockedAt) {
            return achievement;
          }

          // 조건 타입이 일치하는지 확인
          if (achievement.condition.type !== type) {
            return achievement;
          }

          // 진행도 업데이트
          const updated = {
            ...achievement,
            condition: {
              ...achievement.condition,
              current: Math.max(achievement.condition.current, current),
            },
          };

          // 달성 여부 확인
          if (current >= achievement.condition.target) {
            updated.unlockedAt = new Date();
            unlocked.push(updated);
          }

          return updated;
        });

        set({ achievements: updatedAchievements });

        // 달성된 업적에 대한 보상 처리
        unlocked.forEach((achievement) => {
          get().unlockAchievement(achievement.id);
        });

        return unlocked;
      },

      unlockAchievement: (achievementId) => {
        const state = get();
        const achievement = state.achievements.find((a) => a.id === achievementId);

        if (!achievement || achievement.unlockedAt) {
          return;
        }

        // 보상 지급
        const { reward } = achievement;
        const gameStore = useGameStore.getState();
        const avatarStore = useAvatarStore.getState();

        // XP 지급
        if (reward.xp > 0) {
          gameStore.addXP(reward.xp, 'achievement');
        }

        // 스킬포인트 지급
        if (reward.skillPoints) {
          gameStore.addSkillPoints(reward.skillPoints);
        }

        // 아이템 해금
        if (reward.itemUnlock) {
          avatarStore.unlockItem(reward.itemUnlock);
        }

        // 업적 달성 표시
        const now = new Date();
        const updatedAchievements = state.achievements.map((a) =>
          a.id === achievementId ? { ...a, unlockedAt: now } : a
        );

        set({
          achievements: updatedAchievements,
          recentUnlock: { ...achievement, unlockedAt: now },
        });
      },

      getProgress: (achievementId) => {
        const achievement = get().achievements.find((a) => a.id === achievementId);
        if (!achievement) {
          return { current: 0, target: 0, percentage: 0 };
        }

        const { current, target } = achievement.condition;
        const percentage = Math.min((current / target) * 100, 100);

        return { current, target, percentage };
      },

      getUnlockedCount: () => {
        return get().achievements.filter((a) => a.unlockedAt).length;
      },

      getTotalCount: () => {
        return get().achievements.filter((a) => !a.isHidden || a.unlockedAt).length;
      },

      getByCategory: (category) => {
        return get().achievements.filter(
          (a) => a.category === category && (!a.isHidden || a.unlockedAt)
        );
      },

      clearRecentUnlock: () => {
        set({ recentUnlock: null });
      },

      reset: () => {
        set({
          achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: null })),
          recentUnlock: null,
        });
      },
    }),
    {
      name: 'codehero-achievements',
    }
  )
);

// 업적 체크 헬퍼 함수
export const checkAchievements = (type: string, value: number) => {
  return useAchievementStore.getState().checkAchievement(type, value);
};
