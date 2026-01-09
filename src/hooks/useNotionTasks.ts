import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  updateTaskStatus,
  createTask,
  type INotionTask,
  getTasksDatabaseId,
} from '../api/notion';
import { useGameStore } from '../stores';
import type { TaskDifficulty, TaskTag } from '../types';

// 태스크 목록 조회 훅
export function useNotionTasks(filter?: { status?: INotionTask['status'] }) {
  const dbId = getTasksDatabaseId();

  return useQuery({
    queryKey: ['notion-tasks', filter],
    queryFn: () => getTasks(filter),
    enabled: !!dbId,
    staleTime: 1000 * 60, // 1분
  });
}

// 태스크 완료 훅
export function useCompleteTask() {
  const queryClient = useQueryClient();
  const { addXP, calculateTaskXP, incrementStat, checkAndUpdateStreak } = useGameStore();

  return useMutation({
    mutationFn: async (task: INotionTask) => {
      // XP 계산
      const xp = calculateTaskXP(task.difficulty, task.tags);

      // Notion 업데이트
      const updatedTask = await updateTaskStatus(task.id, 'Done', xp);

      return { task: updatedTask, xp };
    },
    onSuccess: ({ task, xp }) => {
      // XP 추가
      const result = addXP(xp, 'task_complete');

      // 통계 업데이트
      incrementStat('tasksCompleted');

      // 버그 수정 태스크면 버그 카운트도 증가
      if (task.tags.includes('bug_fix')) {
        incrementStat('bugFixCount');
      }

      // 출석 체크
      checkAndUpdateStreak();

      // 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['notion-tasks'] });

      return result;
    },
  });
}

// 태스크 생성 훅
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; difficulty: TaskDifficulty; tags: TaskTag[] }) =>
      createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion-tasks'] });
    },
  });
}

// 태스크 상태 변경 훅
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: INotionTask['status'] }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion-tasks'] });
    },
  });
}
