import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  IGameState,
  IStats,
  XPSourceType,
  TaskDifficulty,
  TaskTag,
} from '../types';
import {
  LEVEL_TABLE,
  BASE_XP,
  TASK_DIFFICULTY_MULTIPLIER,
  TASK_TAG_BONUS,
} from '../types';

interface IGameStore extends IGameState {
  // Actions
  addXP: (amount: number, source: XPSourceType) => { leveledUp: boolean; newLevel: number };
  calculateTaskXP: (difficulty: TaskDifficulty, tags: TaskTag[]) => number;
  checkAndUpdateStreak: () => { isNewCheckIn: boolean; bonusXP: number };
  isCheckedInToday: () => boolean;
  incrementStat: (stat: keyof IStats, amount?: number) => void;
  useSkillPoints: (amount: number) => boolean;
  addSkillPoints: (amount: number) => void;
  getXPToNextLevel: () => number;
  getCurrentLevelInfo: () => { level: number; title: string; requiredXP: number };
  syncFromNotion: (totalXP: number) => void;
  reset: () => void;
}

const initialState: IGameState = {
  level: 1,
  currentXP: 0,
  totalXP: 0,
  skillPoints: 0,
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: '',
  },
  stats: {
    tasksCompleted: 0,
    notesCreated: 0,
    goalsAchieved: 0,
    totalStudyMinutes: 0,
    codeReviewCount: 0,
    bugFixCount: 0,
  },
};

const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const useGameStore = create<IGameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount, _source) => {
        const state = get();
        let newCurrentXP = state.currentXP + amount;
        let newTotalXP = state.totalXP + amount;
        let newLevel = state.level;
        let newSkillPoints = state.skillPoints;
        let leveledUp = false;

        // 레벨업 체크
        while (newLevel < 50) {
          const nextLevelXP = LEVEL_TABLE[newLevel]?.requiredXP || Infinity;
          if (newTotalXP >= nextLevelXP) {
            newLevel++;
            newSkillPoints++;
            leveledUp = true;
          } else {
            break;
          }
        }

        // 현재 레벨 기준 XP 계산
        const currentLevelXP = LEVEL_TABLE[newLevel - 1]?.requiredXP || 0;
        newCurrentXP = newTotalXP - currentLevelXP;

        set({
          currentXP: newCurrentXP,
          totalXP: newTotalXP,
          level: newLevel,
          skillPoints: newSkillPoints,
        });

        return { leveledUp, newLevel };
      },

      calculateTaskXP: (difficulty, tags) => {
        let xp = BASE_XP.task_complete;

        // 난이도 배율 적용
        xp *= TASK_DIFFICULTY_MULTIPLIER[difficulty];

        // 태그 보너스 적용
        tags.forEach((tag) => {
          if (TASK_TAG_BONUS[tag]) {
            xp += TASK_TAG_BONUS[tag];
          }
        });

        return Math.round(xp);
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const today = getTodayString();
        const lastActive = state.streak.lastActiveDate;

        if (lastActive === today) {
          // 이미 오늘 활동함
          return { isNewCheckIn: false, bonusXP: 0 };
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        let newCurrent = state.streak.current;
        let newLongest = state.streak.longest;

        if (lastActive === yesterdayString) {
          // 연속 유지
          newCurrent++;
        } else if (lastActive === '') {
          // 첫 활동
          newCurrent = 1;
        } else {
          // 연속 끊김
          newCurrent = 1;
        }

        if (newCurrent > newLongest) {
          newLongest = newCurrent;
        }

        set({
          streak: {
            current: newCurrent,
            longest: newLongest,
            lastActiveDate: today,
          },
        });

        // 연속 출석 보너스 XP (첫날은 daily_login, 연속시 streak_bonus 추가)
        let bonusXP = BASE_XP.daily_login;
        get().addXP(bonusXP, 'daily_login');

        if (newCurrent > 1) {
          const streakBonus = BASE_XP.streak_bonus * Math.min(newCurrent, 30);
          get().addXP(streakBonus, 'streak_bonus');
          bonusXP += streakBonus;
        }

        return { isNewCheckIn: true, bonusXP };
      },

      isCheckedInToday: () => {
        const state = get();
        const today = getTodayString();
        return state.streak.lastActiveDate === today;
      },

      incrementStat: (stat, amount = 1) => {
        set((state) => ({
          stats: {
            ...state.stats,
            [stat]: state.stats[stat] + amount,
          },
        }));
      },

      useSkillPoints: (amount) => {
        const state = get();
        if (state.skillPoints >= amount) {
          set({ skillPoints: state.skillPoints - amount });
          return true;
        }
        return false;
      },

      addSkillPoints: (amount) => {
        set((state) => ({
          skillPoints: state.skillPoints + amount,
        }));
      },

      getXPToNextLevel: () => {
        const state = get();
        if (state.level >= 50) return 0;

        const currentLevelXP = LEVEL_TABLE[state.level - 1]?.requiredXP || 0;
        const nextLevelXP = LEVEL_TABLE[state.level]?.requiredXP || 0;

        return nextLevelXP - currentLevelXP;
      },

      getCurrentLevelInfo: () => {
        const state = get();
        const levelInfo = LEVEL_TABLE[state.level - 1] || LEVEL_TABLE[0];
        return levelInfo;
      },

      syncFromNotion: (notionTotalXP: number) => {
        // Notion 분석 결과로 레벨 동기화
        let newLevel = 1;
        for (let i = 0; i < LEVEL_TABLE.length; i++) {
          if (notionTotalXP >= LEVEL_TABLE[i].requiredXP) {
            newLevel = LEVEL_TABLE[i].level;
          } else {
            break;
          }
        }

        // 현재 레벨의 시작 XP (LEVEL_TABLE은 0-indexed, level은 1-indexed)
        // Level 12 → LEVEL_TABLE[11] = { level: 12, requiredXP: 6600 }
        const currentLevelStartXP = LEVEL_TABLE[newLevel - 1]?.requiredXP || 0;
        const newCurrentXP = notionTotalXP - currentLevelStartXP;

        set({
          level: newLevel,
          totalXP: notionTotalXP,
          currentXP: newCurrentXP,
        });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'codehero-game',
    }
  )
);
