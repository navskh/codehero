import type { ITodoItem, TodoBlockType } from '../types/task';

// 작업 유형 정의
export type WorkType =
  | 'coding'
  | 'bugfix'
  | 'devops'
  | 'documentation'
  | 'review'
  | 'meeting'
  | 'learning'
  | 'design'
  | 'general';

// 작업 유형별 기본 XP
export const BASE_XP: Record<WorkType, number> = {
  coding: 30,
  bugfix: 35,
  devops: 40,
  documentation: 20,
  review: 20,
  meeting: 10,
  learning: 25,
  design: 25,
  general: 15,
};

// 제목 패턴 (우선순위 순서대로)
const TITLE_PATTERNS: { type: WorkType; pattern: RegExp }[] = [
  // bugfix: 버그/오류/문제 해결
  { type: 'bugfix', pattern: /버그|bug|fix|오류|에러|error|hotfix|취약점|injection|blocking|해결|현상/i },
  // devops: 배포/인프라/클라우드
  { type: 'devops', pattern: /배포|deploy|docker|helm|k8s|kubernetes|CI\/CD|인프라|argocd|jenkins|파이프라인|클라우드|cloud|서버|server|container|vault/i },
  // review: 코드 리뷰
  { type: 'review', pattern: /리뷰|review|코드\s?리뷰|PR|pull\s?request|MR|merge/i },
  // meeting: 회의/미팅
  { type: 'meeting', pattern: /미팅|회의|싱크|sync|회고|retro|스크럼|scrum|데일리|daily|스탠드업|면담/i },
  // documentation: 문서/정리/QA
  { type: 'documentation', pattern: /문서|doc|API\s?명세|스펙|spec|가이드|guide|README|위키|wiki|분석|보고서|정리|매뉴얼|manual|QA|테스트|Dolist/i },
  // learning: 학습/튜토리얼
  { type: 'learning', pattern: /학습|스터디|study|공부|강의|course|튜토리얼|tutorial|TIL/i },
  // design: 설계/기획/정책
  { type: 'design', pattern: /설계|기획|아키텍처|architecture|ERD|플로우|flow|와이어프레임|wireframe|디자인|네이밍|naming|철학|컨셉|concept|스토리보드|정책|구성/i },
  // coding: 개발/구현/기능 (가장 넓은 범위)
  { type: 'coding', pattern: /개발|구현|코딩|백엔드|백단|프론트|frontend|backend|API|기능|feature|모듈|컴포넌트|만들기|로그인|페이지|MCP|연동|설정|로직|picker|드롭다운|dropdown|이미지|image|uploader|upload|테이블|table|데이터베이스|DB|리팩토링|refactor|최적화|optimization|프로젝트|적용|전환|변경|교체|작업|항목|암호화|encrypt|템플릿|template|숨기기|스케줄|schedule|연결|메뉴|결제|빌드|vite|webpack|React|Next|Lexical|초대|invite|code|center|센터/i },
];

// 제목으로 작업 유형 감지
export function detectWorkType(title: string): WorkType {
  for (const { type, pattern } of TITLE_PATTERNS) {
    if (pattern.test(title)) {
      return type;
    }
  }
  return 'general';
}

// 작업 유형 정보 반환 (타입 + 기본 XP)
export function getWorkTypeInfo(title: string): { type: WorkType; baseXP: number } {
  const type = detectWorkType(title);
  return {
    type,
    baseXP: BASE_XP[type],
  };
}

// ============================================
// Step 3: 콘텐츠 깊이 분석
// ============================================

// Notion 블록 타입 (간소화)
export interface NotionBlock {
  type: string;
  [key: string]: unknown;
}

// 콘텐츠 깊이 정의
export type ContentDepth = 'shallow' | 'medium' | 'deep';

// 깊이별 XP 배율
export const DEPTH_MULTIPLIER: Record<ContentDepth, number> = {
  shallow: 0.5,
  medium: 1.0,
  deep: 2.0,
};

// 블록에서 텍스트 추출
function extractTextFromBlock(block: NotionBlock): string {
  const textTypes = [
    'paragraph', 'heading_1', 'heading_2', 'heading_3',
    'bulleted_list_item', 'numbered_list_item', 'toggle', 'quote',
    'callout', 'to_do',
  ];

  for (const textType of textTypes) {
    const content = block[textType] as { rich_text?: Array<{ plain_text: string }> } | undefined;
    if (content?.rich_text) {
      return content.rich_text.map(t => t.plain_text).join('');
    }
  }

  // 코드 블록
  if (block.type === 'code') {
    const codeContent = block.code as { rich_text?: Array<{ plain_text: string }> } | undefined;
    return codeContent?.rich_text?.map(t => t.plain_text).join('') || '';
  }

  return '';
}

// 전체 텍스트 길이 계산
function extractTotalTextLength(blocks: NotionBlock[]): number {
  return blocks.reduce((total, block) => {
    return total + extractTextFromBlock(block).length;
  }, 0);
}

// 깊이 점수 계산
export function calculateDepthScore(blocks: NotionBlock[]): number {
  const blockCount = blocks.length;
  const codeBlockCount = blocks.filter(b => b.type === 'code').length;
  const textLength = extractTotalTextLength(blocks);

  // 점수 = 블록수 + (코드블록 × 5) + (글자수 / 100)
  return blockCount + (codeBlockCount * 5) + Math.floor(textLength / 100);
}

// 깊이 판정
export function calculateDepth(blocks: NotionBlock[]): ContentDepth {
  const score = calculateDepthScore(blocks);

  if (score < 10) return 'shallow';
  if (score < 50) return 'medium';
  return 'deep';
}

// 깊이 정보 반환 (깊이 + 배율 + 점수)
export function getDepthInfo(blocks: NotionBlock[]): {
  depth: ContentDepth;
  multiplier: number;
  score: number;
} {
  const score = calculateDepthScore(blocks);
  const depth = score < 10 ? 'shallow' : score < 50 ? 'medium' : 'deep';

  return {
    depth,
    multiplier: DEPTH_MULTIPLIER[depth],
    score,
  };
}

// ============================================
// Step 4: 최종 XP 계산
// ============================================

export interface PageAnalysis {
  title: string;
  workType: WorkType;
  baseXP: number;
  depth: ContentDepth;
  depthMultiplier: number;
  depthScore: number;
  finalXP: number;
}

// 페이지 전체 분석 (제목 + 블록)
export function analyzePage(title: string, blocks: NotionBlock[]): PageAnalysis {
  const { type: workType, baseXP } = getWorkTypeInfo(title);
  const { depth, multiplier: depthMultiplier, score: depthScore } = getDepthInfo(blocks);

  // 최종 XP = 기본XP × 깊이배율
  const finalXP = Math.round(baseXP * depthMultiplier);

  return {
    title,
    workType,
    baseXP,
    depth,
    depthMultiplier,
    depthScore,
    finalXP,
  };
}

// ============================================
// Step 4: 스킬 브랜치 매핑
// ============================================

// 스킬 브랜치 정의
export type SkillBranch = 'frontend' | 'backend' | 'devops' | 'softskills' | 'general';

// 기술 키워드 → 스킬 브랜치 매핑
const TECH_KEYWORDS: Record<SkillBranch, RegExp> = {
  frontend: /react|next\.?js|vue|angular|css|tailwind|styled|scss|sass|html|컴포넌트|component|UI|프론트|frontend|레이아웃|layout|반응형|responsive|애니메이션|animation/i,
  backend: /express|node|nestjs|api|sql|mssql|mysql|postgres|mongodb|백엔드|backend|서버|server|엔드포인트|endpoint|쿼리|query|데이터베이스|database|DB|인증|auth|jwt|session/i,
  devops: /docker|k8s|kubernetes|helm|argocd|jenkins|ci\/cd|배포|deploy|인프라|infra|클라우드|cloud|aws|azure|gcp|nginx|로드밸런서|container|파이프라인|pipeline|모니터링|monitoring/i,
  softskills: /미팅|회의|리뷰|review|기획|설계|문서|doc|커뮤니케이션|협업|일정|스크럼|애자일|agile/i,
  general: /.*/,
};

// 작업 유형 → 기본 스킬 브랜치 매핑
const WORKTYPE_TO_SKILL: Record<WorkType, SkillBranch> = {
  coding: 'general',      // 키워드로 세분화
  bugfix: 'general',      // 키워드로 세분화
  devops: 'devops',
  documentation: 'softskills',
  review: 'softskills',
  meeting: 'softskills',
  learning: 'general',
  design: 'softskills',
  general: 'general',
};

// 텍스트에서 스킬 브랜치 감지
function detectSkillFromText(text: string): SkillBranch | null {
  // 우선순위: frontend, backend, devops (specific → general)
  if (TECH_KEYWORDS.frontend.test(text)) return 'frontend';
  if (TECH_KEYWORDS.backend.test(text)) return 'backend';
  if (TECH_KEYWORDS.devops.test(text)) return 'devops';
  if (TECH_KEYWORDS.softskills.test(text)) return 'softskills';
  return null;
}

// 블록들에서 모든 텍스트 추출
function extractAllText(blocks: NotionBlock[]): string {
  return blocks.map(block => {
    const textTypes = [
      'paragraph', 'heading_1', 'heading_2', 'heading_3',
      'bulleted_list_item', 'numbered_list_item', 'code',
    ];
    for (const textType of textTypes) {
      const content = block[textType] as { rich_text?: Array<{ plain_text: string }> } | undefined;
      if (content?.rich_text) {
        return content.rich_text.map(t => t.plain_text).join(' ');
      }
    }
    return '';
  }).join(' ');
}

// 스킬 브랜치 결정 (제목 + 작업유형 + 콘텐츠 분석)
export function detectSkillBranch(
  title: string,
  workType: WorkType,
  blocks: NotionBlock[]
): SkillBranch {
  // 1. 제목에서 스킬 감지
  const titleSkill = detectSkillFromText(title);
  if (titleSkill && titleSkill !== 'softskills') return titleSkill;

  // 2. 작업 유형이 명확한 경우 (devops, meeting 등)
  const defaultSkill = WORKTYPE_TO_SKILL[workType];
  if (defaultSkill !== 'general') return defaultSkill;

  // 3. 콘텐츠에서 스킬 감지
  const allText = extractAllText(blocks);
  const contentSkill = detectSkillFromText(allText);
  if (contentSkill) return contentSkill;

  return 'general';
}

// 스킬별 XP 분배 결과
export interface SkillXP {
  frontend: number;
  backend: number;
  devops: number;
  softskills: number;
  general: number;
}

// 전체 분석 결과 (스킬 포함)
export interface FullPageAnalysis extends PageAnalysis {
  skillBranch: SkillBranch;
  skillXP: SkillXP;
}

// 페이지 전체 분석 (스킬 브랜치 포함)
export function analyzePageFull(title: string, blocks: NotionBlock[]): FullPageAnalysis {
  const basic = analyzePage(title, blocks);
  const skillBranch = detectSkillBranch(title, basic.workType, blocks);

  // XP를 해당 스킬에 배분
  const skillXP: SkillXP = {
    frontend: 0,
    backend: 0,
    devops: 0,
    softskills: 0,
    general: 0,
  };
  skillXP[skillBranch] = basic.finalXP;

  return {
    ...basic,
    skillBranch,
    skillXP,
  };
}

// ============================================
// 블록에서 할일 추출
// ============================================

// 할일 키워드 패턴
const TODO_TEXT_PATTERNS = [
  /^할\s?일\s*[:：]?\s*/i,
  /^TODO\s*[:：]?\s*/i,
  /^해야\s?할\s*[:：]?\s*/i,
  /^작업\s*[:：]?\s*/i,
  /^\[\s*\]\s*/,  // [ ] 체크박스 패턴
  /^[-*]\s*\[\s*\]\s*/,  // - [ ] 또는 * [ ] 패턴
];

// 완료 키워드 패턴
const COMPLETED_PATTERNS = [
  /^완료\s*[:：]?\s*/i,
  /^Done\s*[:：]?\s*/i,
  /^\[x\]/i,
  /^\[X\]/i,
  /^[-*]\s*\[x\]/i,
  /^[-*]\s*\[X\]/i,
];

// 블록에서 텍스트와 완료 상태 추출
function extractTodoFromBlock(block: NotionBlock): { text: string; isCompleted: boolean; type: TodoBlockType } | null {
  // to_do 블록 처리 (Notion 체크박스)
  if (block.type === 'to_do') {
    const todoContent = block.to_do as {
      rich_text?: Array<{ plain_text: string; annotations?: { strikethrough?: boolean } }>;
      checked?: boolean;
    } | undefined;

    if (todoContent?.rich_text) {
      const text = todoContent.rich_text.map(t => t.plain_text).join('');
      const hasStrikethrough = todoContent.rich_text.some(t => t.annotations?.strikethrough);
      const isCompleted = todoContent.checked === true || hasStrikethrough;

      if (text.trim()) {
        return { text: text.trim(), isCompleted, type: 'todo' };
      }
    }
    return null;
  }

  // paragraph 블록에서 할일 패턴 찾기
  if (block.type === 'paragraph') {
    const content = block.paragraph as {
      rich_text?: Array<{ plain_text: string; annotations?: { strikethrough?: boolean } }>;
    } | undefined;

    if (content?.rich_text) {
      const text = content.rich_text.map(t => t.plain_text).join('');
      const hasStrikethrough = content.rich_text.some(t => t.annotations?.strikethrough);

      // 완료 패턴 체크
      for (const pattern of COMPLETED_PATTERNS) {
        if (pattern.test(text)) {
          const cleanText = text.replace(pattern, '').trim();
          if (cleanText) {
            return { text: cleanText, isCompleted: true, type: 'text' };
          }
        }
      }

      // 할일 패턴 체크
      for (const pattern of TODO_TEXT_PATTERNS) {
        if (pattern.test(text)) {
          const cleanText = text.replace(pattern, '').trim();
          if (cleanText) {
            return { text: cleanText, isCompleted: hasStrikethrough, type: 'text' };
          }
        }
      }
    }
  }

  // bulleted_list_item에서 할일 추출 (- 로 시작하는 모든 항목)
  if (block.type === 'bulleted_list_item') {
    const content = block.bulleted_list_item as {
      rich_text?: Array<{ plain_text: string; annotations?: { strikethrough?: boolean } }>;
    } | undefined;

    if (content?.rich_text) {
      const text = content.rich_text.map(t => t.plain_text).join('');
      const hasStrikethrough = content.rich_text.some(t => t.annotations?.strikethrough);

      // [ ] 또는 [x] 패턴 체크
      if (/^\[\s*[xX]?\s*\]/.test(text)) {
        const isCompleted = /^\[\s*[xX]\s*\]/.test(text) || hasStrikethrough;
        const cleanText = text.replace(/^\[\s*[xX]?\s*\]\s*/, '').trim();
        if (cleanText) {
          return { text: cleanText, isCompleted, type: 'bullet' };
        }
      }

      // 완료 패턴 체크
      for (const pattern of COMPLETED_PATTERNS) {
        if (pattern.test(text)) {
          const cleanText = text.replace(pattern, '').trim();
          if (cleanText) {
            return { text: cleanText, isCompleted: true, type: 'bullet' };
          }
        }
      }

      // 할일 키워드 체크
      for (const pattern of TODO_TEXT_PATTERNS) {
        if (pattern.test(text)) {
          const cleanText = text.replace(pattern, '').trim();
          if (cleanText) {
            return { text: cleanText, isCompleted: hasStrikethrough, type: 'bullet' };
          }
        }
      }

      // 그 외 모든 bulleted_list_item은 할일로 처리
      if (text.trim()) {
        return { text: text.trim(), isCompleted: hasStrikethrough, type: 'bullet' };
      }
    }
  }

  return null;
}

// 블록 ID 추출 (타입 안전)
function getBlockId(block: NotionBlock): string {
  return (block as { id?: string }).id || `block-${Math.random().toString(36).substr(2, 9)}`;
}

// 페이지의 블록들에서 할일 목록 추출
export function extractTodosFromBlocks(
  blocks: NotionBlock[],
  pageId: string,
  pageTitle: string,
  pageUrl: string
): ITodoItem[] {
  const todos: ITodoItem[] = [];

  for (const block of blocks) {
    const todoInfo = extractTodoFromBlock(block);
    if (todoInfo) {
      todos.push({
        id: getBlockId(block),
        pageId,
        pageTitle,
        pageUrl,
        text: todoInfo.text,
        isCompleted: todoInfo.isCompleted,
        type: todoInfo.type,
      });
    }
  }

  return todos;
}
