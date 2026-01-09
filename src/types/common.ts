// 공통 타입 정의 (순환 참조 방지용)

// const 배열에서 타입 추출 (런타임 값 + 타입 모두 제공)
export const TASK_DIFFICULTIES = ['trivial', 'easy', 'medium', 'hard', 'epic'] as const;
export type TaskDifficulty = typeof TASK_DIFFICULTIES[number];

export const TASK_TAGS = ['bug_fix', 'feature', 'refactor', 'review', 'docs', 'learning', 'devops', 'testing'] as const;
export type TaskTag = typeof TASK_TAGS[number];
