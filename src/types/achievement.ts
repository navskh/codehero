// 업적 타입 정의

export type AchievementCategory =
  | 'tasks'
  | 'learning'
  | 'streak'
  | 'milestone'
  | 'special';

export type AchievementRarity = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  condition: IAchievementCondition;
  reward: IAchievementReward;
  isHidden: boolean;
  unlockedAt: Date | null;
}

export interface IAchievementCondition {
  type: string;
  target: number;
  current: number;
}

export interface IAchievementReward {
  xp: number;
  skillPoints?: number;
  itemUnlock?: string;
  title?: string;
}

// 업적 희귀도 색상
export const ACHIEVEMENT_RARITY_COLORS: Record<AchievementRarity, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
};

// 기본 업적 정의
export const DEFAULT_ACHIEVEMENTS: IAchievement[] = [
  // 태스크 관련
  {
    id: 'first_task',
    name: '첫 발걸음',
    description: '첫 번째 태스크를 완료하세요',
    icon: '👣',
    category: 'tasks',
    rarity: 'bronze',
    condition: { type: 'tasks_completed', target: 1, current: 0 },
    reward: { xp: 50, itemUnlock: 'acc_headphones' },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'tasks_10',
    name: '일꾼',
    description: '10개의 태스크를 완료하세요',
    icon: '🔨',
    category: 'tasks',
    rarity: 'bronze',
    condition: { type: 'tasks_completed', target: 10, current: 0 },
    reward: { xp: 100 },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'tasks_50',
    name: '숙련된 일꾼',
    description: '50개의 태스크를 완료하세요',
    icon: '⚒️',
    category: 'tasks',
    rarity: 'silver',
    condition: { type: 'tasks_completed', target: 50, current: 0 },
    reward: { xp: 300, skillPoints: 1 },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'tasks_100',
    name: '작업의 달인',
    description: '100개의 태스크를 완료하세요',
    icon: '🏆',
    category: 'tasks',
    rarity: 'gold',
    condition: { type: 'tasks_completed', target: 100, current: 0 },
    reward: { xp: 500, skillPoints: 2, title: '작업의 달인' },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'tasks_500',
    name: '전설의 일꾼',
    description: '500개의 태스크를 완료하세요',
    icon: '👑',
    category: 'tasks',
    rarity: 'platinum',
    condition: { type: 'tasks_completed', target: 500, current: 0 },
    reward: { xp: 2000, skillPoints: 5, title: '전설의 일꾼' },
    isHidden: false,
    unlockedAt: null,
  },
  // 버그 수정 관련
  {
    id: 'bug_hunter',
    name: '버그 사냥꾼',
    description: '10개의 버그를 수정하세요',
    icon: '🐛',
    category: 'tasks',
    rarity: 'silver',
    condition: { type: 'bugs_fixed', target: 10, current: 0 },
    reward: { xp: 200, title: '버그 사냥꾼' },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'bug_exterminator',
    name: '버그 근절자',
    description: '100개의 버그를 수정하세요',
    icon: '🦠',
    category: 'tasks',
    rarity: 'gold',
    condition: { type: 'bugs_fixed', target: 100, current: 0 },
    reward: { xp: 1000, skillPoints: 3, title: '버그 근절자' },
    isHidden: false,
    unlockedAt: null,
  },
  // 학습 관련
  {
    id: 'first_note',
    name: '기록의 시작',
    description: '첫 번째 학습 노트를 작성하세요',
    icon: '📝',
    category: 'learning',
    rarity: 'bronze',
    condition: { type: 'notes_created', target: 1, current: 0 },
    reward: { xp: 50 },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'notes_10',
    name: '꾸준한 학습자',
    description: '10개의 학습 노트를 작성하세요',
    icon: '📚',
    category: 'learning',
    rarity: 'silver',
    condition: { type: 'notes_created', target: 10, current: 0 },
    reward: { xp: 250, title: '꾸준한 학습자' },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'study_time_1000',
    name: '천 분의 노력',
    description: '총 1000분 학습하세요',
    icon: '⏱️',
    category: 'learning',
    rarity: 'gold',
    condition: { type: 'study_minutes', target: 1000, current: 0 },
    reward: { xp: 500, skillPoints: 2 },
    isHidden: false,
    unlockedAt: null,
  },
  // 연속 출석 관련
  {
    id: 'streak_3',
    name: '3일 연속',
    description: '3일 연속 활동하세요',
    icon: '🔥',
    category: 'streak',
    rarity: 'bronze',
    condition: { type: 'streak_days', target: 3, current: 0 },
    reward: { xp: 50 },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'streak_7',
    name: '일주일의 기적',
    description: '7일 연속 활동하세요',
    icon: '🔥',
    category: 'streak',
    rarity: 'silver',
    condition: { type: 'streak_days', target: 7, current: 0 },
    reward: { xp: 200 },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'streak_30',
    name: '한 달의 열정',
    description: '30일 연속 활동하세요',
    icon: '💪',
    category: 'streak',
    rarity: 'gold',
    condition: { type: 'streak_days', target: 30, current: 0 },
    reward: { xp: 1000, itemUnlock: 'effect_flame', title: '불꽃의 의지' },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'streak_100',
    name: '백일의 기적',
    description: '100일 연속 활동하세요',
    icon: '⭐',
    category: 'streak',
    rarity: 'platinum',
    condition: { type: 'streak_days', target: 100, current: 0 },
    reward: { xp: 5000, skillPoints: 5, title: '백일의 기적' },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'streak_365',
    name: '1년의 헌신',
    description: '365일 연속 활동하세요',
    icon: '🌟',
    category: 'streak',
    rarity: 'diamond',
    condition: { type: 'streak_days', target: 365, current: 0 },
    reward: { xp: 20000, skillPoints: 10, title: '전설의 코더' },
    isHidden: false,
    unlockedAt: null,
  },
  // 마일스톤
  {
    id: 'level_10',
    name: '시니어 개발자',
    description: '레벨 10에 도달하세요',
    icon: '🎖️',
    category: 'milestone',
    rarity: 'silver',
    condition: { type: 'level_reached', target: 10, current: 0 },
    reward: { xp: 500, skillPoints: 2 },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'level_25',
    name: '개발의 달인',
    description: '레벨 25에 도달하세요',
    icon: '🏅',
    category: 'milestone',
    rarity: 'gold',
    condition: { type: 'level_reached', target: 25, current: 0 },
    reward: { xp: 2000, skillPoints: 5 },
    isHidden: false,
    unlockedAt: null,
  },
  {
    id: 'level_50',
    name: '전설의 아키텍트',
    description: '레벨 50에 도달하세요',
    icon: '👑',
    category: 'milestone',
    rarity: 'diamond',
    condition: { type: 'level_reached', target: 50, current: 0 },
    reward: { xp: 10000, skillPoints: 20, itemUnlock: 'effect_rainbow', title: '전설의 아키텍트' },
    isHidden: false,
    unlockedAt: null,
  },
  // 특별 업적 (히든)
  {
    id: 'night_owl',
    name: '밤의 코더',
    description: '자정 이후에 10개의 태스크를 완료하세요',
    icon: '🦉',
    category: 'special',
    rarity: 'gold',
    condition: { type: 'tasks_completed_after_midnight', target: 10, current: 0 },
    reward: { xp: 500, itemUnlock: 'acc_coffee', title: '야행성 개발자' },
    isHidden: true,
    unlockedAt: null,
  },
  {
    id: 'early_bird',
    name: '일찍 일어난 새',
    description: '오전 6시 이전에 10개의 태스크를 완료하세요',
    icon: '🐦',
    category: 'special',
    rarity: 'gold',
    condition: { type: 'tasks_completed_before_6am', target: 10, current: 0 },
    reward: { xp: 500, title: '아침형 개발자' },
    isHidden: true,
    unlockedAt: null,
  },
  {
    id: 'speed_demon',
    name: '스피드 데몬',
    description: '하루에 10개의 태스크를 완료하세요',
    icon: '⚡',
    category: 'special',
    rarity: 'gold',
    condition: { type: 'tasks_in_one_day', target: 10, current: 0 },
    reward: { xp: 500, title: '폭풍 코더' },
    isHidden: true,
    unlockedAt: null,
  },
  {
    id: 'perfectionist',
    name: '완벽주의자',
    description: 'epic 난이도 태스크 5개를 완료하세요',
    icon: '💎',
    category: 'special',
    rarity: 'platinum',
    condition: { type: 'epic_tasks_completed', target: 5, current: 0 },
    reward: { xp: 1000, skillPoints: 3, title: '완벽주의자' },
    isHidden: true,
    unlockedAt: null,
  },
  {
    id: 'goal_crusher',
    name: '목표 달성자',
    description: '5개의 목표를 달성하세요',
    icon: '🎯',
    category: 'milestone',
    rarity: 'gold',
    condition: { type: 'goals_achieved', target: 5, current: 0 },
    reward: { xp: 1000, skillPoints: 3, title: '목표 달성자' },
    isHidden: false,
    unlockedAt: null,
  },
];
