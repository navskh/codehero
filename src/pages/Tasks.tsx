import { useState, useMemo, useEffect } from 'react';
import { PixelBox } from '../components/common/PixelBox';
import { getRelativeTime } from '../hooks/useNotionAll';
import { useContentAnalysis } from '../hooks/useContentAnalysis';
import type { ITodoItem } from '../types/task';

// 완료 상태 localStorage 키
const COMPLETED_TODOS_KEY = 'codehero-completed-todos';

// 완료된 할일 ID 로드
function loadCompletedTodos(): Set<string> {
  try {
    const saved = localStorage.getItem(COMPLETED_TODOS_KEY);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Failed to load completed todos:', e);
  }
  return new Set();
}

// 완료된 할일 ID 저장
function saveCompletedTodos(completed: Set<string>) {
  try {
    localStorage.setItem(COMPLETED_TODOS_KEY, JSON.stringify([...completed]));
  } catch (e) {
    console.error('Failed to save completed todos:', e);
  }
}

// 블록 타입 아이콘
function getTodoTypeIcon(type: ITodoItem['type']): string {
  switch (type) {
    case 'todo': return '☑️';
    case 'text': return '📝';
    case 'bullet': return '•';
    default: return '📋';
  }
}

export function Tasks() {
  const {
    todos,
    isLoading,
    syncState,
    sync,
  } = useContentAnalysis();

  // 로컬 완료 상태 (Notion에서 가져온 상태와 별개로 로컬에서 관리)
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(() => loadCompletedTodos());
  const [showCompleted, setShowCompleted] = useState(true);
  const [groupByPage, setGroupByPage] = useState(false);

  // 완료 상태 변경 시 저장
  useEffect(() => {
    saveCompletedTodos(localCompleted);
  }, [localCompleted]);

  // 할일 목록 (Notion 상태 + 로컬 상태 병합)
  const processedTodos = useMemo(() => {
    return todos.map(todo => ({
      ...todo,
      // Notion에서 완료 처리되었거나, 로컬에서 완료 처리된 경우
      isCompleted: todo.isCompleted || localCompleted.has(todo.id),
    }));
  }, [todos, localCompleted]);

  // 완료/미완료 분리
  const incompleteTodos = processedTodos.filter(t => !t.isCompleted);
  const completedTodos = processedTodos.filter(t => t.isCompleted);

  // 페이지별 그룹화
  const groupedByPage = useMemo(() => {
    const groups = new Map<string, { pageTitle: string; pageUrl: string; todos: typeof processedTodos }>();

    for (const todo of processedTodos) {
      const existing = groups.get(todo.pageId);
      if (existing) {
        existing.todos.push(todo);
      } else {
        groups.set(todo.pageId, {
          pageTitle: todo.pageTitle,
          pageUrl: todo.pageUrl,
          todos: [todo],
        });
      }
    }

    return Array.from(groups.values());
  }, [processedTodos]);

  // 체크박스 토글
  const toggleTodo = (id: string) => {
    setLocalCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 로딩 상태
  if (isLoading && todos.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title gradient-text mb-2">할 일 목록</h1>
          <p className="text-[#8888aa] text-sm">Notion 블록 기반 To-Do</p>
        </div>
        <PixelBox className="p-10 text-center">
          <div className="w-10 h-10 mx-auto border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#8888aa]">
            {syncState.isSyncing
              ? `문서 분석 중... (${syncState.progress}/${syncState.total})`
              : 'Notion에서 문서를 가져오는 중...'}
          </p>
        </PixelBox>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title gradient-text mb-2">할 일 목록</h1>
          <p className="text-[#8888aa] text-sm">
            Notion 블록 기반 To-Do
            {syncState.lastSyncTime && (
              <span className="ml-2 text-[#666688]">
                · 마지막 동기화: {getRelativeTime(syncState.lastSyncTime)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => sync()}
          disabled={syncState.isSyncing}
          className="btn-secondary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
        >
          <span className={syncState.isSyncing ? 'animate-spin' : ''}>🔄</span>
          {syncState.isSyncing
            ? `동기화 중 (${syncState.progress}/${syncState.total})`
            : '동기화'}
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#00d4ff]">{processedTodos.length}</p>
          <p className="text-xs text-[#8888aa] mt-1">전체 할일</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#6bcb77]">{completedTodos.length}</p>
          <p className="text-xs text-[#8888aa] mt-1">완료</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#ff6b6b]">{incompleteTodos.length}</p>
          <p className="text-xs text-[#8888aa] mt-1">미완료</p>
        </PixelBox>
      </div>

      {/* 필터 & 보기 옵션 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowCompleted(false)}
            className={`category-tab ${!showCompleted ? 'category-tab-active' : ''}`}
          >
            미완료 ({incompleteTodos.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`category-tab ${showCompleted ? 'category-tab-active' : ''}`}
          >
            전체 보기 ({processedTodos.length})
          </button>
        </div>
        <button
          onClick={() => setGroupByPage(!groupByPage)}
          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
            groupByPage
              ? 'bg-[rgba(0,212,255,0.2)] text-[#00d4ff]'
              : 'bg-[rgba(0,0,0,0.2)] text-[#8888aa] hover:text-white'
          }`}
        >
          📁 페이지별 그룹화
        </button>
      </div>

      {/* To-Do 목록 */}
      <PixelBox className="p-5">
        {processedTodos.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📋</span>
            <p className="text-[#8888aa] mb-2">할 일이 없습니다</p>
            <p className="text-xs text-[#666688]">
              Notion에서 체크박스(to_do) 블록을 추가하거나<br />
              "할일:", "TODO:" 등으로 시작하는 텍스트를 작성하면<br />
              여기에 표시됩니다.
            </p>
          </div>
        ) : groupByPage ? (
          // 페이지별 그룹화 보기
          <div className="space-y-6">
            {groupedByPage.map((group) => {
              const groupIncomplete = group.todos.filter(t => !t.isCompleted);
              const groupCompleted = group.todos.filter(t => t.isCompleted);
              const visibleTodos = showCompleted ? group.todos : groupIncomplete;

              if (visibleTodos.length === 0) return null;

              return (
                <div key={group.pageTitle} className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-[rgba(90,90,154,0.2)]">
                    <a
                      href={group.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#00d4ff] hover:underline"
                    >
                      📄 {group.pageTitle}
                    </a>
                    <span className="text-xs text-[#666688]">
                      ({groupCompleted.length}/{group.todos.length} 완료)
                    </span>
                  </div>
                  {visibleTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      showPageTitle={false}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          // 일반 목록 보기
          <div className="space-y-2">
            {/* 미완료 목록 */}
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                showPageTitle={true}
              />
            ))}

            {/* 완료 목록 (showCompleted가 true일 때만) */}
            {showCompleted && completedTodos.length > 0 && (
              <>
                {incompleteTodos.length > 0 && (
                  <div className="border-t border-[rgba(90,90,154,0.2)] my-4" />
                )}
                <p className="text-xs text-[#666688] mb-2">완료된 항목</p>
                {completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    showPageTitle={true}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </PixelBox>

      {/* 안내 */}
      <div className="mt-4 p-4 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)]">
        <p className="text-xs text-[#8888aa]">
          💡 <strong>To-Do 인식 방법</strong>
        </p>
        <ul className="text-xs text-[#666688] mt-2 space-y-1 ml-4 list-disc">
          <li>Notion 체크박스(to_do) 블록</li>
          <li>"할일:", "TODO:", "해야할:", "작업:" 으로 시작하는 텍스트</li>
          <li>"[ ]" 또는 "[x]" 패턴의 불릿 리스트</li>
          <li>취소선 또는 "완료:", "Done:" 은 완료로 처리</li>
        </ul>
      </div>
    </div>
  );
}

// Todo 아이템 컴포넌트
interface ITodoItemProps {
  todo: ITodoItem;
  onToggle: (id: string) => void;
  showPageTitle: boolean;
}

function TodoItem({ todo, onToggle, showPageTitle }: ITodoItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-all group ${
        todo.isCompleted
          ? 'bg-[rgba(0,0,0,0.1)] opacity-60'
          : 'bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,212,255,0.1)] border border-transparent hover:border-[rgba(0,212,255,0.2)]'
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
          todo.isCompleted
            ? 'border-[#6bcb77] bg-[rgba(107,203,119,0.2)]'
            : 'border-[#8888aa] hover:border-[#00d4ff]'
        }`}
      >
        {todo.isCompleted && <span className="text-[#6bcb77] text-sm">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">{getTodoTypeIcon(todo.type)}</span>
          <p className={`font-medium ${todo.isCompleted ? 'line-through text-[#666688]' : 'group-hover:text-[#00d4ff]'} transition-colors`}>
            {todo.text}
          </p>
        </div>
        {showPageTitle && (
          <a
            href={todo.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#555566] hover:text-[#00d4ff] mt-1 inline-block"
          >
            📄 {todo.pageTitle}
          </a>
        )}
      </div>
    </div>
  );
}
