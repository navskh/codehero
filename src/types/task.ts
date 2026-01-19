// 태스크 타입 정의 (Notion 연동용)

import type { TaskDifficulty, TaskTag } from './common';

// ============================================
// 블록 기반 할일 추출용 타입
// ============================================

export type TodoBlockType = 'todo' | 'text' | 'bullet';

export interface ITodoItem {
  id: string;           // 블록 ID
  pageId: string;       // 소속 페이지 ID
  pageTitle: string;    // 소속 페이지 제목
  pageUrl: string;      // 소속 페이지 URL
  text: string;         // 할일 내용
  isCompleted: boolean; // 완료 여부
  type: TodoBlockType;  // 블록 타입
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ITask {
  id: string;
  notionPageId: string;
  title: string;
  status: TaskStatus;
  difficulty: TaskDifficulty;
  tags: TaskTag[];
  category: TaskCategory;
  dueDate: Date | null;
  completedAt: Date | null;
  xpEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCategory =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'database'
  | 'mobile'
  | 'testing'
  | 'documentation'
  | 'design'
  | 'other';

export interface ILearningNote {
  id: string;
  notionPageId: string;
  title: string;
  category: TaskCategory;
  tags: string[];
  studyTime: number; // 분
  xpEarned: number;
  createdAt: Date;
}

export interface IGoal {
  id: string;
  notionPageId: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  targetDate: Date | null;
  progress: number; // 0-100
  xpReward: number;
  createdAt: Date;
  completedAt: Date | null;
}

// Notion 속성 매핑
export const NOTION_TASK_PROPERTIES = {
  name: 'Name',
  status: 'Status',
  difficulty: 'Difficulty',
  tags: 'Tags',
  category: 'Category',
  dueDate: 'Due Date',
  completedAt: 'Completed At',
  xpEarned: 'XP Earned',
} as const;

export const NOTION_NOTE_PROPERTIES = {
  title: 'Title',
  category: 'Category',
  tags: 'Tags',
  studyTime: 'Study Time',
  xpEarned: 'XP Earned',
} as const;

export const NOTION_GOAL_PROPERTIES = {
  title: 'Title',
  status: 'Status',
  targetDate: 'Target Date',
  progress: 'Progress',
  xpReward: 'XP Reward',
} as const;

// Notion 상태 값 매핑
export const NOTION_STATUS_MAP: Record<string, TaskStatus> = {
  'Todo': 'todo',
  'To Do': 'todo',
  '할 일': 'todo',
  'In Progress': 'in_progress',
  '진행 중': 'in_progress',
  'Done': 'done',
  '완료': 'done',
};

export const NOTION_DIFFICULTY_MAP: Record<string, TaskDifficulty> = {
  'Trivial': 'trivial',
  '매우 쉬움': 'trivial',
  'Easy': 'easy',
  '쉬움': 'easy',
  'Medium': 'medium',
  '보통': 'medium',
  'Hard': 'hard',
  '어려움': 'hard',
  'Epic': 'epic',
  '매우 어려움': 'epic',
};
