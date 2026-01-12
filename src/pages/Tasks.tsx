import { useState, useMemo, useEffect } from 'react';
import { PixelBox } from '../components/common/PixelBox';
import { getRelativeTime } from '../hooks/useNotionAll';
import { useContentAnalysis } from '../hooks/useContentAnalysis';

// To-Do 판별 키워드
const TODO_KEYWORDS = [
  'todo', 'TODO', 'Todo',
  '할일', '할 일',
  '작업', '해야할',
  '진행중', '진행 중',
  '미완료', '대기',
  '예정', '계획',
];

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

export function Tasks() {
  const {
    pages,
    isLoading,
    syncState,
    sync,
  } = useContentAnalysis({ autoSync: true, pollingInterval: 5 * 60 * 1000 });

  const [completedTodos, setCompletedTodos] = useState<Set<string>>(() => loadCompletedTodos());
  const [showCompleted, setShowCompleted] = useState(true);

  // 완료 상태 변경 시 저장
  useEffect(() => {
    saveCompletedTodos(completedTodos);
  }, [completedTodos]);

  // To-Do 항목 필터링 (키워드 기반)
  const todoPages = useMemo(() => {
    return pages.filter(page => {
      const title = page.title.toLowerCase();
      return TODO_KEYWORDS.some(keyword => title.includes(keyword.toLowerCase()));
    });
  }, [pages]);

  // 완료/미완료 분리
  const incompleteTodos = todoPages.filter(p => !completedTodos.has(p.id));
  const completedTodoList = todoPages.filter(p => completedTodos.has(p.id));

  // 체크박스 토글
  const toggleTodo = (id: string) => {
    setCompletedTodos(prev => {
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
  if (isLoading && pages.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="font-pixel text-2xl gradient-text mb-2">할 일 목록</h1>
          <p className="text-[#8888aa] text-sm">Notion 문서 기반 To-Do</p>
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
          <h1 className="font-pixel text-2xl gradient-text mb-2">할 일 목록</h1>
          <p className="text-[#8888aa] text-sm">
            Notion 문서 기반 To-Do
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
          <p className="text-3xl font-bold text-[#00d4ff]">{todoPages.length}</p>
          <p className="text-xs text-[#8888aa] mt-1">전체 할일</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#6bcb77]">{completedTodoList.length}</p>
          <p className="text-xs text-[#8888aa] mt-1">완료</p>
        </PixelBox>
        <PixelBox hover className="p-4 text-center">
          <p className="text-3xl font-bold text-[#ff6b6b]">{incompleteTodos.length}</p>
          <p className="text-xs text-[#8888aa] mt-1">미완료</p>
        </PixelBox>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-4">
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
          전체 보기 ({todoPages.length})
        </button>
      </div>

      {/* To-Do 목록 */}
      <PixelBox className="p-5">
        {todoPages.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📋</span>
            <p className="text-[#8888aa] mb-2">할 일이 없습니다</p>
            <p className="text-xs text-[#666688]">
              Notion에서 제목에 "할일", "TODO", "작업", "진행중" 등의<br />
              키워드가 포함된 문서를 작성하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* 미완료 목록 */}
            {incompleteTodos.map((page) => (
              <div
                key={page.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,212,255,0.1)] border border-transparent hover:border-[rgba(0,212,255,0.2)] transition-all group"
              >
                <button
                  onClick={() => toggleTodo(page.id)}
                  className="w-6 h-6 rounded border-2 border-[#8888aa] hover:border-[#00d4ff] flex items-center justify-center transition-colors flex-shrink-0"
                >
                  {/* 빈 체크박스 */}
                </button>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium truncate group-hover:text-[#00d4ff] transition-colors">
                    {page.title}
                  </p>
                  <p className="text-xs text-[#666688] mt-0.5">
                    {getRelativeTime(page.lastEditedTime)}
                  </p>
                </a>
              </div>
            ))}

            {/* 완료 목록 (showCompleted가 true일 때만) */}
            {showCompleted && completedTodoList.length > 0 && (
              <>
                {incompleteTodos.length > 0 && (
                  <div className="border-t border-[rgba(90,90,154,0.2)] my-4" />
                )}
                <p className="text-xs text-[#666688] mb-2">완료된 항목</p>
                {completedTodoList.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.1)] opacity-60 transition-all group"
                  >
                    <button
                      onClick={() => toggleTodo(page.id)}
                      className="w-6 h-6 rounded border-2 border-[#6bcb77] bg-[rgba(107,203,119,0.2)] flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <span className="text-[#6bcb77] text-sm">✓</span>
                    </button>
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0"
                    >
                      <p className="font-medium truncate line-through text-[#666688]">
                        {page.title}
                      </p>
                      <p className="text-xs text-[#555566] mt-0.5">
                        {getRelativeTime(page.lastEditedTime)}
                      </p>
                    </a>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </PixelBox>

      {/* 안내 */}
      <div className="mt-4 p-4 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)]">
        <p className="text-xs text-[#8888aa]">
          💡 <strong>To-Do 인식 키워드</strong>: TODO, 할일, 작업, 해야할, 진행중, 미완료, 대기, 예정, 계획
        </p>
      </div>
    </div>
  );
}
