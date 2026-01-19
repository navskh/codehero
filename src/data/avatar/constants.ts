/**
 * Avatar System Constants
 *
 * 모든 아바타 관련 상수를 중앙에서 관리합니다.
 */

// ============================================
// 렌더링 상수
// ============================================

/** 기본 픽셀 그리드 크기 */
export const PIXEL_GRID_SIZE = 28;

/** 기본 픽셀 스케일 */
export const PIXEL_SCALE = 2;

/** 사이즈별 픽셀 크기 매핑 */
export const AVATAR_SIZE_MAP = {
	sm: PIXEL_GRID_SIZE * PIXEL_SCALE, // 56px
	md: PIXEL_GRID_SIZE * PIXEL_SCALE * 1.5, // 84px
	lg: PIXEL_GRID_SIZE * PIXEL_SCALE * 2, // 112px
	xl: PIXEL_GRID_SIZE * PIXEL_SCALE * 3, // 168px
} as const;

export type AvatarSize = keyof typeof AVATAR_SIZE_MAP;

// ============================================
// 레이어 시스템
// ============================================

/** 레이어 ID 타입 */
export type LayerId =
	| 'background'
	| 'hair_back'
	| 'body'
	| 'outfit'
	| 'face'
	| 'accessory'
	| 'hair_front'
	| 'effect';

/** 레이어별 z-index (렌더링 순서) */
export const LAYER_Z_INDEX: Record<LayerId, number> = {
	background: -1,
	hair_back: 0,
	body: 1,
	outfit: 2,
	face: 3,
	accessory: 4,
	hair_front: 5,
	effect: 6,
};

/** 레이어 렌더링 순서 (낮은 z-index부터) */
export const LAYER_RENDER_ORDER: LayerId[] = [
	'background',
	'hair_back',
	'body',
	'outfit',
	'face',
	'accessory',
	'hair_front',
	'effect',
];

// ============================================
// 컬러 팔레트
// ============================================

/** 피부색 팔레트 */
export const SKIN_PALETTE = [
	'#ffe8d6', // 0 - 밝은 피부
	'#ffd4b8', // 1
	'#f5c9a0', // 2
	'#e5b78e', // 3
	'#c49360', // 4
	'#a67c52', // 5 - 어두운 피부
] as const;

/** 머리색 팔레트 */
export const HAIR_PALETTE = [
	'#1a1a2e', // 0 - 검정
	'#2d2d44', // 1 - 진회색
	'#4a3728', // 2 - 갈색
	'#6b4423', // 3 - 밤색
	'#8b5a2b', // 4 - 밝은 갈색
	'#daa520', // 5 - 금발
] as const;

/** 눈 관련 색상 */
export const EYE_COLORS = {
	white: '#ffffff',
	pupil: '#2d1b4e',
	highlight: '#ffffff',
	highlight2: '#a8d8ff',
} as const;

/** 기타 색상 */
export const MISC_COLORS = {
	blush: '#ffb4b4',
	mouth: '#d4a574',
	glasses: '#87ceeb',
	glassesFrame: '#4a5568',
	laptop: '#374151',
	laptopScreen: '#67e8f9',
} as const;

/** 의상 색상 매핑 */
export const OUTFIT_COLORS: Record<string, string> = {
	outfit_casual: '#5b9bd5',
	outfit_hoodie: '#4a5568',
	outfit_suit: '#2d3748',
};

// ============================================
// 아이템 레어리티
// ============================================

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/** 레어리티별 색상 */
export const RARITY_COLORS: Record<ItemRarity, string> = {
	common: '#9CA3AF',
	uncommon: '#10B981',
	rare: '#3B82F6',
	epic: '#8B5CF6',
	legendary: '#F59E0B',
};

/** 레어리티별 글로우 색상 */
export const RARITY_GLOW: Record<ItemRarity, string> = {
	common: 'rgba(156, 163, 175, 0.3)',
	uncommon: 'rgba(16, 185, 129, 0.3)',
	rare: 'rgba(59, 130, 246, 0.4)',
	epic: 'rgba(139, 92, 246, 0.5)',
	legendary: 'rgba(245, 158, 11, 0.6)',
};

// ============================================
// 애니메이션
// ============================================

export type AnimationName =
	| 'idle'
	| 'happy'
	| 'coding'
	| 'thinking'
	| 'levelup'
	| 'achievement';

/** 애니메이션 기본 설정 */
export const ANIMATION_CONFIG = {
	idle: { frameCount: 2, duration: 1000, loop: true },
	happy: { frameCount: 4, duration: 800, loop: true },
	coding: { frameCount: 3, duration: 600, loop: true },
	thinking: { frameCount: 2, duration: 1200, loop: true },
	levelup: { frameCount: 6, duration: 1500, loop: false },
	achievement: { frameCount: 4, duration: 1000, loop: false },
} as const;

// ============================================
// 아이템 카테고리
// ============================================

export type ItemCategory = 'hair' | 'outfit' | 'accessory' | 'background' | 'effect';

/** 카테고리 메타데이터 */
export const CATEGORY_META: Record<
	ItemCategory,
	{ label: string; icon: string; layer: LayerId }
> = {
	hair: { label: '헤어', icon: '💇', layer: 'hair_front' },
	outfit: { label: '의상', icon: '👕', layer: 'outfit' },
	accessory: { label: '악세서리', icon: '🎀', layer: 'accessory' },
	background: { label: '배경', icon: '🖼️', layer: 'background' },
	effect: { label: '이펙트', icon: '✨', layer: 'effect' },
};

// ============================================
// 언락 조건 타입
// ============================================

export type UnlockConditionType = 'default' | 'level' | 'achievement' | 'skill';

export interface IUnlockCondition {
	type: UnlockConditionType;
	value: number | string;
}
