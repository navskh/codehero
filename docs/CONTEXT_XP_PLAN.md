# CodeHero - 문맥 기반 XP 시스템 구현 계획

## 목표

**현재**: 문서 개수 × 15 XP = 단순한 계산
**원하는 것**: "내가 실제로 뭘 했는지" 이해하는 XP 시스템

---

## 핵심 아이디어

```
                      +-------------------+
                      |   Notion 페이지   |
                      +-------------------+
                              |
              +---------------+---------------+
              |                               |
        제목 분석                        콘텐츠 분석
        (빠름)                          (블록 가져오기)
              |                               |
              v                               v
        +----------+                   +------------+
        | 작업유형 |                   | 깊이 판정  |
        +----------+                   +------------+
              |                               |
              +---------------+---------------+
                              |
                              v
                      +---------------+
                      | XP = 기본XP × 깊이배율 + 보너스 |
                      +---------------+
```

---

## Step 1: 블록 API 추가

`server/index.js`에 추가:

```javascript
app.get('/api/notion/pages/:id/blocks', async (req, res) => {
  const blocks = await notion.blocks.children.list({
    block_id: req.params.id
  });
  res.json({ success: true, blocks: blocks.results });
});
```

---

## Step 2: 작업 유형 분류

| 유형 | 감지 키워드 | 기본 XP |
|------|------------|---------|
| `coding` | 개발, 구현, 백엔드, 프론트 | 30 |
| `bugfix` | 버그, fix, 오류, 수정 | 35 |
| `devops` | 배포, docker, helm, CI/CD | 40 |
| `documentation` | API 명세, 문서, 가이드 | 20 |
| `review` | 리뷰, 코드리뷰, PR | 20 |
| `meeting` | 미팅, 회의, 싱크 | 10 |
| `learning` | 학습, 스터디, 공부 | 25 |
| `design` | 설계, 기획, 아키텍처 | 25 |

```typescript
// src/lib/contentAnalyzer.ts
const TITLE_PATTERNS = {
  coding: /백엔드?|프론트|개발|구현|코딩/i,
  devops: /배포|docker|helm|CI\/CD|인프라/i,
  meeting: /미팅|회의|싱크|회고/i,
  // ...
};

function detectWorkType(title: string): WorkType {
  for (const [type, pattern] of Object.entries(TITLE_PATTERNS)) {
    if (pattern.test(title)) return type as WorkType;
  }
  return 'general';
}
```

---

## Step 3: 콘텐츠 깊이 분석

블록을 가져와서 **얼마나 깊이 있는 작업인지** 판단:

```typescript
type ContentDepth = 'shallow' | 'medium' | 'deep';

function calculateDepth(blocks: Block[]): ContentDepth {
  const score =
    blocks.length +                                    // 블록 수
    blocks.filter(b => b.type === 'code').length * 5 + // 코드블록 가중치
    Math.floor(extractTextLength(blocks) / 100);       // 글자수

  if (score < 10) return 'shallow';  // 배율 0.5
  if (score < 50) return 'medium';   // 배율 1.0
  return 'deep';                      // 배율 2.0
}
```

---

## Step 4: XP 계산 공식

```
최종 XP = 기본XP(작업유형) × 깊이배율 + 프로젝트보너스
```

**예시**:
| 페이지 | 작업유형 | 깊이 | 계산 | XP |
|--------|----------|------|------|-----|
| jabis 백단 설정 | coding | deep | 30 × 2.0 + 5 | **65** |
| JINSIM 리뷰 | review | medium | 20 × 1.0 + 5 | **25** |
| 미팅 노트 | meeting | shallow | 10 × 0.5 | **5** |

---

## Step 5: 스킬 브랜치 매핑

작업 유형에 따라 스킬포인트 분배:

```
coding (React, CSS)  → Frontend
coding (Node, API)   → Backend
devops               → DevOps
meeting, review      → Soft Skills
```

기술 키워드로 더 정확하게:
```typescript
const TECH_KEYWORDS = {
  frontend: ['react', 'next.js', 'css', 'tailwind'],
  backend: ['express', 'node', 'api', 'sql'],
  devops: ['docker', 'k8s', 'helm', 'argocd'],
};
```

---

## Step 6: 성능 최적화 (캐싱)

40개 페이지 블록을 매번 가져오면 느림 → **캐싱**

```typescript
interface IAnalysisCache {
  pageId: string;
  lastAnalyzed: string;
  workType: WorkType;
  depth: ContentDepth;
  xp: number;
}

// localStorage에 저장
// 페이지 수정일이 분석일보다 새로우면 재분석
```

---

## 파일 구조

```
src/
├── lib/
│   └── contentAnalyzer.ts   # 분석 엔진 (NEW)
├── stores/
│   └── contentStore.ts      # 캐시 상태 (NEW)
├── hooks/
│   └── useContentAnalysis.ts # React 훅 (NEW)
├── pages/
│   └── Tasks.tsx            # 대시보드 (수정)
server/
└── index.js                 # 블록 API (수정)
```

---

## 검증

1. `npm run server` - API 서버 실행
2. `curl http://localhost:3001/api/notion/pages/{id}/blocks` - 블록 가져오기 테스트
3. `npm run dev` - 대시보드에서 XP 확인
4. 작업 유형별로 XP가 다르게 나오는지 확인

---

## 요약

| Before | After |
|--------|-------|
| 문서 40개 × 15 = 600 XP | 작업별 차등 XP |
| 모든 문서 동일 | 코딩 > 미팅 |
| 깊이 무시 | deep 작업 2배 보상 |
