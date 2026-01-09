import { PixelBox } from '../components/common/PixelBox';

export function Notes() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-pixel text-2xl text-pixel-primary mb-6">학습 노트</h1>

      <PixelBox className="p-8 text-center">
        <p className="text-6xl mb-4">📚</p>
        <h2 className="text-xl mb-2">Notion 연결 필요</h2>
        <p className="text-gray-400 mb-4">
          설정에서 Notion을 연결하면 학습 노트를 가져올 수 있습니다.
        </p>
        <button
          className="pixel-btn"
          onClick={() => window.location.href = '/settings'}
        >
          Notion 연결하기
        </button>
      </PixelBox>
    </div>
  );
}
