// 게임 상태 타입 정의

import { TASK_DIFFICULTIES, TASK_TAGS, type TaskDifficulty, type TaskTag } from './common';

// Re-export for convenience
export { TASK_DIFFICULTIES, TASK_TAGS };

export interface IUser {
  id: string;
  notionUserId: string;
  name: string;
  email: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface IGameState {
  level: number;
  currentXP: number;
  totalXP: number;
  skillPoints: number;
  streak: IStreak;
  stats: IStats;
}

export interface IStreak {
  current: number;
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface IStats {
  tasksCompleted: number;
  notesCreated: number;
  goalsAchieved: number;
  totalStudyMinutes: number;
  codeReviewCount: number;
  bugFixCount: number;
}

export interface ILevelRequirement {
  level: number;
  requiredXP: number;
  title: string;
}

// 레벨 테이블 (50레벨까지)
export const LEVEL_TABLE: ILevelRequirement[] = [
  { level: 1, requiredXP: 0, title: '견습 개발자' },
  { level: 2, requiredXP: 100, title: '초보 개발자' },
  { level: 3, requiredXP: 300, title: '성장하는 개발자' },
  { level: 4, requiredXP: 600, title: '주니어 개발자' },
  { level: 5, requiredXP: 1000, title: '숙련된 주니어' },
  { level: 6, requiredXP: 1500, title: '중급 개발자' },
  { level: 7, requiredXP: 2100, title: '실력있는 개발자' },
  { level: 8, requiredXP: 2800, title: '시니어 후보' },
  { level: 9, requiredXP: 3600, title: '예비 시니어' },
  { level: 10, requiredXP: 4500, title: '시니어 개발자' },
  { level: 11, requiredXP: 5500, title: '숙련된 시니어' },
  { level: 12, requiredXP: 6600, title: '테크 리드 후보' },
  { level: 13, requiredXP: 7800, title: '팀 리더' },
  { level: 14, requiredXP: 9100, title: '테크 리드' },
  { level: 15, requiredXP: 10500, title: '수석 개발자' },
  { level: 16, requiredXP: 12000, title: '아키텍트 후보' },
  { level: 17, requiredXP: 13600, title: '주니어 아키텍트' },
  { level: 18, requiredXP: 15300, title: '아키텍트' },
  { level: 19, requiredXP: 17100, title: '시니어 아키텍트' },
  { level: 20, requiredXP: 19000, title: '수석 아키텍트' },
  { level: 21, requiredXP: 21000, title: 'CTO 후보' },
  { level: 22, requiredXP: 23100, title: '기술 임원' },
  { level: 23, requiredXP: 25300, title: 'CTO' },
  { level: 24, requiredXP: 27600, title: '테크 비저너리' },
  { level: 25, requiredXP: 30000, title: '개발의 달인' },
  { level: 26, requiredXP: 33000, title: '코드 마스터' },
  { level: 27, requiredXP: 36000, title: '프로그래밍 현자' },
  { level: 28, requiredXP: 39000, title: '디지털 연금술사' },
  { level: 29, requiredXP: 42000, title: '비트의 조련사' },
  { level: 30, requiredXP: 45000, title: '알고리즘 대가' },
  { level: 31, requiredXP: 48500, title: '시스템의 지배자' },
  { level: 32, requiredXP: 52000, title: '코드 철학자' },
  { level: 33, requiredXP: 55500, title: '데이터의 현인' },
  { level: 34, requiredXP: 59000, title: '네트워크 마법사' },
  { level: 35, requiredXP: 63000, title: '클라우드 정복자' },
  { level: 36, requiredXP: 67000, title: 'AI 조련사' },
  { level: 37, requiredXP: 71000, title: '풀스택 전설' },
  { level: 38, requiredXP: 75000, title: '테크 레전드' },
  { level: 39, requiredXP: 80000, title: '코딩의 신' },
  { level: 40, requiredXP: 85000, title: '0과 1의 지배자' },
  { level: 41, requiredXP: 90000, title: '버그 사냥꾼' },
  { level: 42, requiredXP: 95000, title: '우주의 답을 아는 자' },
  { level: 43, requiredXP: 100000, title: '메타 프로그래머' },
  { level: 44, requiredXP: 106000, title: '양자 개발자' },
  { level: 45, requiredXP: 112000, title: '차원을 넘는 코더' },
  { level: 46, requiredXP: 118000, title: '시간을 다루는 자' },
  { level: 47, requiredXP: 125000, title: '무한 루프 탈출자' },
  { level: 48, requiredXP: 132000, title: '특이점의 창조자' },
  { level: 49, requiredXP: 140000, title: '코드의 신화' },
  { level: 50, requiredXP: 150000, title: '전설의 아키텍트' },
];

export type XPSourceType =
  | 'task_complete'
  | 'note_create'
  | 'goal_milestone'
  | 'goal_complete'
  | 'daily_login'
  | 'streak_bonus'
  | 'achievement';

export const BASE_XP: Record<XPSourceType, number> = {
  task_complete: 10,
  note_create: 25,
  goal_milestone: 50,
  goal_complete: 200,
  daily_login: 5,
  streak_bonus: 10,
  achievement: 0, // 업적별로 다름
};

export const TASK_DIFFICULTY_MULTIPLIER: Record<TaskDifficulty, number> = {
  trivial: 0.5,
  easy: 1.0,
  medium: 1.5,
  hard: 2.5,
  epic: 4.0,
};

export const TASK_TAG_BONUS: Record<TaskTag, number> = {
  bug_fix: 5,
  feature: 10,
  refactor: 8,
  review: 7,
  docs: 5,
  learning: 15,
  devops: 12,
  testing: 8,
};
