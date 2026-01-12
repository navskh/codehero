import { useState } from 'react';
import { PixelBox } from '../components/common/PixelBox';
import { useGameStore, useAvatarStore, useAchievementStore } from '../stores';
import { useNotionConnection, useNotionDatabases, getDatabaseTitle } from '../hooks';
import { setTasksDatabaseId, getTasksDatabaseId } from '../api/notion';

export function Settings() {
  const [selectedTasksDb, setSelectedTasksDb] = useState<string>(getTasksDatabaseId() || '');

  const gameStore = useGameStore();
  const avatarStore = useAvatarStore();
  const achievementStore = useAchievementStore();

  // Notion 연결 상태
  const { data: connectionData, isLoading: isConnecting, error: connectionError, refetch: testConnection } = useNotionConnection();

  // 데이터베이스 목록
  const { data: databasesData, isLoading: isLoadingDbs } = useNotionDatabases();

  const isConnected = connectionData?.success;
  const databases = databasesData?.databases || [];

  // 데이터베이스 선택 핸들러
  const handleSelectTasksDb = (dbId: string) => {
    setSelectedTasksDb(dbId);
    setTasksDatabaseId(dbId);
  };

  const handleReset = () => {
    if (window.confirm('정말로 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      gameStore.reset();
      avatarStore.reset();
      achievementStore.reset();
      localStorage.removeItem('codehero-tasks-db-id');
      setSelectedTasksDb('');
      alert('모든 데이터가 초기화되었습니다.');
    }
  };

  const handleTestXP = () => {
    const result = gameStore.addXP(100, 'task_complete');
    if (result.leveledUp) {
      alert(`레벨업! Lv.${result.newLevel}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-pixel text-2xl gradient-text mb-2">설정</h1>
        <p className="text-[#8888aa] text-sm">앱 설정 및 Notion 연동을 관리합니다</p>
      </div>

      {/* Notion 연결 */}
      <PixelBox variant="gradient" className="p-6 mb-6">
        <h2 className="text-sm text-[#8888aa] mb-4 flex items-center gap-2">
          <span className="text-[#00d4ff]">🔗</span> Notion 연결 상태
        </h2>

        {isConnecting ? (
          <div className="flex items-center gap-3 text-[#8888aa]">
            <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
            <span>연결 확인 중...</span>
          </div>
        ) : connectionError ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#ff6b6b]">
              <span className="text-2xl">❌</span>
              <span>연결 실패: {(connectionError as Error).message}</span>
            </div>
            <p className="text-sm text-[#8888aa]">
              서버가 실행 중인지 확인하세요: <code className="text-[#00d4ff]">npm run server</code>
            </p>
            <button onClick={() => testConnection()} className="btn-secondary px-4 py-2">
              다시 시도
            </button>
          </div>
        ) : isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#6bcb77]">
              <span className="text-2xl">✅</span>
              <span>Notion이 연결되었습니다!</span>
            </div>

            {/* 데이터베이스 선택 */}
            <div className="mt-4 p-4 rounded-lg bg-[rgba(0,0,0,0.3)]">
              <h3 className="text-sm text-[#8888aa] mb-3">태스크 데이터베이스 선택</h3>

              {isLoadingDbs ? (
                <p className="text-[#8888aa]">데이터베이스 목록 불러오는 중...</p>
              ) : databases.length === 0 ? (
                <div className="text-[#ff6b6b] text-sm">
                  <p>연결된 데이터베이스가 없습니다.</p>
                  <p className="text-[#8888aa] mt-2">
                    Notion에서 데이터베이스를 만들고 Integration을 연결하세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {databases.map((db: any) => (
                    <button
                      key={db.id}
                      onClick={() => handleSelectTasksDb(db.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedTasksDb === db.id
                          ? 'bg-[rgba(0,212,255,0.2)] border border-[#00d4ff]'
                          : 'bg-[rgba(90,90,154,0.2)] hover:bg-[rgba(90,90,154,0.3)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{getDatabaseTitle(db)}</span>
                        {selectedTasksDb === db.id && (
                          <span className="badge badge-primary">선택됨</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#8888aa]">
              Notion API 서버를 먼저 실행해주세요.
            </p>
            <div className="p-4 rounded-lg bg-[rgba(0,0,0,0.3)]">
              <p className="text-xs text-[#8888aa] mb-2">터미널에서 실행:</p>
              <code className="text-[#00d4ff] block p-2 bg-[rgba(0,0,0,0.3)] rounded">
                npm run server
              </code>
            </div>
            <button onClick={() => testConnection()} className="btn-primary px-4 py-2">
              연결 확인
            </button>
          </div>
        )}
      </PixelBox>

      {/* 테스트 기능 */}
      <PixelBox className="p-6 mb-6">
        <h2 className="text-sm text-[#8888aa] mb-4 flex items-center gap-2">
          <span className="text-[#ffd700]">🧪</span> 테스트 기능
        </h2>
        <p className="text-sm text-[#666688] mb-4">
          개발 중 테스트를 위한 기능입니다.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTestXP}
            className="btn-primary px-4 py-2"
          >
            +100 XP
          </button>
          <button
            onClick={() => gameStore.addSkillPoints(1)}
            className="btn-secondary px-4 py-2"
          >
            +1 SP
          </button>
          <button
            onClick={() => {
              gameStore.checkAndUpdateStreak();
              alert('연속 출석 체크됨!');
            }}
            className="btn-secondary px-4 py-2"
          >
            출석 체크
          </button>
        </div>
      </PixelBox>

      {/* 데이터 관리 */}
      <PixelBox className="p-6">
        <h2 className="text-sm text-[#ff6b6b] mb-4 flex items-center gap-2">
          <span>⚠️</span> 위험 영역
        </h2>
        <p className="text-sm text-[#8888aa] mb-4">
          모든 데이터를 초기화합니다. 레벨, XP, 업적, 아바타 설정이 모두 삭제됩니다.
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-[rgba(239,68,68,0.2)] text-[#ff6b6b] border border-[rgba(239,68,68,0.3)] rounded-xl hover:bg-[rgba(239,68,68,0.3)] transition-all"
        >
          데이터 초기화
        </button>
      </PixelBox>
    </div>
  );
}
