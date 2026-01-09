// Notion 태스크 관련 API
import { queryDatabase, updatePage, createPage, type INotionPage } from './client';
import type { TaskDifficulty, TaskTag } from '../../types';

// 태스크 인터페이스
export interface INotionTask {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  difficulty: TaskDifficulty;
  tags: TaskTag[];
  completedAt: string | null;
  xpEarned: number;
  createdAt: string;
}

// 데이터베이스 ID 저장 (Settings에서 설정)
let tasksDbId: string | null = localStorage.getItem('codehero-tasks-db-id');

export function setTasksDatabaseId(id: string) {
  tasksDbId = id;
  localStorage.setItem('codehero-tasks-db-id', id);
}

export function getTasksDatabaseId() {
  return tasksDbId;
}

// Notion 페이지를 태스크로 변환
function pageToTask(page: INotionPage): INotionTask {
  const props = page.properties;

  // 제목 추출
  const titleProp = Object.values(props).find((p) => p.type === 'title') as any;
  const title = titleProp?.title?.[0]?.plain_text || '제목 없음';

  // 상태 추출
  const statusProp = props['Status'] as any;
  const status = statusProp?.select?.name || 'Todo';

  // 난이도 추출
  const difficultyProp = props['Difficulty'] as any;
  const difficulty = (difficultyProp?.select?.name?.toLowerCase() || 'medium') as TaskDifficulty;

  // 태그 추출
  const tagsProp = props['Tags'] as any;
  const tags = (tagsProp?.multi_select?.map((t: any) => t.name) || []) as TaskTag[];

  // 완료일 추출
  const completedAtProp = props['Completed At'] as any;
  const completedAt = completedAtProp?.date?.start || null;

  // XP 추출
  const xpProp = props['XP Earned'] as any;
  const xpEarned = xpProp?.number || 0;

  return {
    id: page.id,
    title,
    status: status as INotionTask['status'],
    difficulty,
    tags,
    completedAt,
    xpEarned,
    createdAt: page.created_time,
  };
}

// 태스크 목록 조회
export async function getTasks(filter?: {
  status?: INotionTask['status'];
}): Promise<INotionTask[]> {
  if (!tasksDbId) {
    throw new Error('태스크 데이터베이스가 설정되지 않았습니다');
  }

  const query: any = {};

  if (filter?.status) {
    query.filter = {
      property: 'Status',
      select: { equals: filter.status },
    };
  }

  query.sorts = [{ property: 'Created time', direction: 'descending' }];

  const response = await queryDatabase(tasksDbId, query);
  return response.results.map(pageToTask);
}

// 태스크 상태 업데이트
export async function updateTaskStatus(
  taskId: string,
  status: INotionTask['status'],
  xpEarned?: number
): Promise<INotionTask> {
  const properties: Record<string, any> = {
    Status: { select: { name: status } },
  };

  if (status === 'Done') {
    properties['Completed At'] = {
      date: { start: new Date().toISOString().split('T')[0] },
    };
    if (xpEarned !== undefined) {
      properties['XP Earned'] = { number: xpEarned };
    }
  }

  const response = await updatePage(taskId, properties);
  return pageToTask(response.page);
}

// 새 태스크 생성
export async function createTask(data: {
  title: string;
  difficulty: TaskDifficulty;
  tags: TaskTag[];
}): Promise<INotionTask> {
  if (!tasksDbId) {
    throw new Error('태스크 데이터베이스가 설정되지 않았습니다');
  }

  const response = await createPage({
    parent: { database_id: tasksDbId },
    properties: {
      Name: {
        title: [{ text: { content: data.title } }],
      },
      Status: { select: { name: 'Todo' } },
      Difficulty: { select: { name: data.difficulty } },
      Tags: {
        multi_select: data.tags.map((tag) => ({ name: tag })),
      },
    },
  });

  return pageToTask(response.page);
}
