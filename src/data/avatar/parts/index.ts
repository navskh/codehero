/**
 * Avatar Parts - 모던 프로페셔널 스타일
 * ViewBox: 128x128
 * 비율: 머리(1) : 몸(2.5) - 성인 비율
 * 스타일: 클린 미니멀 + 스트로크 기반
 */

export const ZMAP_ORDER = [
	'background',
	'hair_back',
	'body',
	'outfit_back',
	'head',
	'ears',
	'face_shadow',
	'eyes',
	'eyebrows',
	'nose',
	'mouth',
	'blush',
	'hair_front',
	'outfit_front',
	'accessory',
	'effect',
] as const;

export type ZmapLayer = (typeof ZMAP_ORDER)[number];

// 피부톤 - 자연스러운 색상
export const SKIN_TONES = {
	fair: '#FFEEE4',
	light: '#FFE0D1',
	medium: '#E5B99A',
	tan: '#C9956C',
	brown: '#A67153',
	dark: '#6B4423',
} as const;

export type SkinTone = keyof typeof SKIN_TONES;

// 헤어 컬러
export const HAIR_COLORS = {
	black: '#1A1A2E',
	darkBrown: '#3D2914',
	brown: '#5C3A21',
	auburn: '#8B4535',
	blonde: '#D4A76A',
	platinum: '#E8DCC4',
	gray: '#6B6B7B',
	blue: '#3A5A80',
	purple: '#5A4A70',
	pink: '#A06070',
} as const;

export type HairColor = keyof typeof HAIR_COLORS;

// 눈 색상
export const EYE_COLORS = {
	black: '#1A1A2E',
	brown: '#4A3728',
	hazel: '#7B6347',
	blue: '#4A7090',
	green: '#4A7C59',
	gray: '#6B6B7B',
} as const;

export type EyeColor = keyof typeof EYE_COLORS;

export interface IAvatarPart {
	id: string;
	name: string;
	category: ZmapLayer;
	svg: (colors: IAvatarColors) => string;
}

export interface IAvatarColors {
	skin: string;
	hair: string;
	eyes: string;
	outfit: string;
}

// 색상 유틸리티
const darken = (color: string, amount: number = 0.1): string => {
	const hex = color.replace('#', '');
	const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - Math.round(255 * amount));
	const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - Math.round(255 * amount));
	const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - Math.round(255 * amount));
	return `rgb(${r},${g},${b})`;
};

const lighten = (color: string, amount: number = 0.1): string => {
	const hex = color.replace('#', '');
	const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + Math.round(255 * amount));
	const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + Math.round(255 * amount));
	const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + Math.round(255 * amount));
	return `rgb(${r},${g},${b})`;
};

// ========== HEAD ==========
// 위치: cx=64, cy=42, 크기: rx=26, ry=28 (좀 더 작게)
export const HEAD_PARTS: IAvatarPart[] = [
	{
		id: 'head_default',
		name: '기본',
		category: 'head',
		svg: ({ skin }) => `
			<ellipse cx="64" cy="42" rx="26" ry="28" fill="${skin}" />
		`,
	},
];

// ========== EARS ==========
export const EARS_PARTS: IAvatarPart[] = [
	{
		id: 'ears_default',
		name: '기본',
		category: 'ears',
		svg: ({ skin }) => `
			<ellipse cx="38" cy="44" rx="4" ry="5" fill="${skin}" />
			<ellipse cx="90" cy="44" rx="4" ry="5" fill="${skin}" />
		`,
	},
];

// ========== FACE SHADOW ==========
export const FACE_SHADOW_PARTS: IAvatarPart[] = [
	{
		id: 'face_shadow_default',
		name: '기본',
		category: 'face_shadow',
		svg: () => ``,
	},
];

// ========== BODY ==========
// 위치: 목 y=68, 어깨 y=76
export const BODY_PARTS: IAvatarPart[] = [
	{
		id: 'body_default',
		name: '기본',
		category: 'body',
		svg: ({ skin }) => `
			<!-- 목 -->
			<rect x="56" y="68" width="16" height="10" rx="2" fill="${skin}" />
			<!-- 어깨/상체 -->
			<path d="M32 80 Q32 76 42 76 L86 76 Q96 76 96 80 L96 128 L32 128 Z" fill="${skin}" />
		`,
	},
];

// ========== EYES ==========
// 위치: y=40, 간격=24 (더 세련된 스타일)
export const EYE_PARTS: IAvatarPart[] = [
	{
		id: 'eyes_default',
		name: '기본',
		category: 'eyes',
		svg: ({ eyes }) => `
			<!-- 눈 - 심플한 도트 스타일 -->
			<circle cx="52" cy="40" r="4" fill="${eyes}" />
			<circle cx="76" cy="40" r="4" fill="${eyes}" />
			<circle cx="53" cy="39" r="1.2" fill="white" opacity="0.7" />
			<circle cx="77" cy="39" r="1.2" fill="white" opacity="0.7" />
		`,
	},
	{
		id: 'eyes_round',
		name: '동그란',
		category: 'eyes',
		svg: ({ eyes }) => `
			<ellipse cx="52" cy="40" rx="6" ry="6" fill="white" />
			<ellipse cx="76" cy="40" rx="6" ry="6" fill="white" />
			<circle cx="52" cy="40" r="4" fill="${eyes}" />
			<circle cx="76" cy="40" r="4" fill="${eyes}" />
			<circle cx="54" cy="38" r="1.5" fill="white" />
			<circle cx="78" cy="38" r="1.5" fill="white" />
		`,
	},
	{
		id: 'eyes_narrow',
		name: '날카로운',
		category: 'eyes',
		svg: ({ eyes }) => `
			<ellipse cx="52" cy="40" rx="7" ry="4" fill="white" />
			<ellipse cx="76" cy="40" rx="7" ry="4" fill="white" />
			<ellipse cx="52" cy="40" rx="4" ry="3" fill="${eyes}" />
			<ellipse cx="76" cy="40" rx="4" ry="3" fill="${eyes}" />
			<circle cx="54" cy="39" r="1" fill="white" />
			<circle cx="78" cy="39" r="1" fill="white" />
		`,
	},
	{
		id: 'eyes_happy',
		name: '웃는',
		category: 'eyes',
		svg: ({ eyes }) => `
			<path d="M46 40 Q52 35 58 40" stroke="${eyes}" stroke-width="3" fill="none" stroke-linecap="round" />
			<path d="M70 40 Q76 35 82 40" stroke="${eyes}" stroke-width="3" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'eyes_wink',
		name: '윙크',
		category: 'eyes',
		svg: ({ eyes }) => `
			<circle cx="52" cy="40" r="4" fill="${eyes}" />
			<circle cx="53" cy="39" r="1.2" fill="white" opacity="0.7" />
			<path d="M70 40 Q76 35 82 40" stroke="${eyes}" stroke-width="3" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'eyes_closed',
		name: '감은',
		category: 'eyes',
		svg: ({ eyes }) => `
			<path d="M46 40 Q52 45 58 40" stroke="${eyes}" stroke-width="2.5" fill="none" stroke-linecap="round" />
			<path d="M70 40 Q76 45 82 40" stroke="${eyes}" stroke-width="2.5" fill="none" stroke-linecap="round" />
		`,
	},
];

// ========== EYEBROWS ==========
// 위치: y=32
export const EYEBROW_PARTS: IAvatarPart[] = [
	{
		id: 'eyebrows_natural',
		name: '자연스러운',
		category: 'eyebrows',
		svg: ({ hair }) => `
			<path d="M46 33 Q52 31 58 33" stroke="${hair}" stroke-width="1.5" fill="none" stroke-linecap="round" />
			<path d="M70 33 Q76 31 82 33" stroke="${hair}" stroke-width="1.5" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'eyebrows_straight',
		name: '일자',
		category: 'eyebrows',
		svg: ({ hair }) => `
			<line x1="46" y1="33" x2="58" y2="33" stroke="${hair}" stroke-width="1.5" stroke-linecap="round" />
			<line x1="70" y1="33" x2="82" y2="33" stroke="${hair}" stroke-width="1.5" stroke-linecap="round" />
		`,
	},
	{
		id: 'eyebrows_arched',
		name: '아치형',
		category: 'eyebrows',
		svg: ({ hair }) => `
			<path d="M46 35 Q52 31 58 33" stroke="${hair}" stroke-width="1.5" fill="none" stroke-linecap="round" />
			<path d="M70 33 Q76 31 82 35" stroke="${hair}" stroke-width="1.5" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'eyebrows_thick',
		name: '굵은',
		category: 'eyebrows',
		svg: ({ hair }) => `
			<path d="M46 33 Q52 30 58 33" stroke="${hair}" stroke-width="2.5" fill="none" stroke-linecap="round" />
			<path d="M70 33 Q76 30 82 33" stroke="${hair}" stroke-width="2.5" fill="none" stroke-linecap="round" />
		`,
	},
];

// ========== NOSE ==========
// 위치: cx=64, y=48
export const NOSE_PARTS: IAvatarPart[] = [
	{
		id: 'nose_small',
		name: '작은',
		category: 'nose',
		svg: ({ skin }) => `
			<ellipse cx="64" cy="50" rx="2" ry="1" fill="${darken(skin, 0.08)}" />
		`,
	},
	{
		id: 'nose_line',
		name: '라인',
		category: 'nose',
		svg: ({ skin }) => `
			<path d="M64 46 L64 52" stroke="${darken(skin, 0.1)}" stroke-width="1.2" stroke-linecap="round" />
		`,
	},
	{
		id: 'nose_round',
		name: '둥근',
		category: 'nose',
		svg: ({ skin }) => `
			<circle cx="64" cy="50" r="2" fill="${darken(skin, 0.06)}" />
		`,
	},
];

// ========== MOUTH ==========
// 위치: y=56
export const MOUTH_PARTS: IAvatarPart[] = [
	{
		id: 'mouth_smile',
		name: '미소',
		category: 'mouth',
		svg: () => `
			<path d="M58 56 Q64 60 70 56" stroke="#B87070" stroke-width="1.5" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'mouth_neutral',
		name: '무표정',
		category: 'mouth',
		svg: () => `
			<line x1="60" y1="58" x2="68" y2="58" stroke="#B87070" stroke-width="1.5" stroke-linecap="round" />
		`,
	},
	{
		id: 'mouth_open',
		name: '열린',
		category: 'mouth',
		svg: () => `
			<ellipse cx="64" cy="58" rx="4" ry="3" fill="#B87070" />
			<ellipse cx="64" cy="57" rx="2.5" ry="1.5" fill="#8B4040" />
		`,
	},
	{
		id: 'mouth_grin',
		name: '씩',
		category: 'mouth',
		svg: () => `
			<path d="M56 56 Q64 62 72 56" stroke="#B87070" stroke-width="1.5" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'mouth_pout',
		name: '뾰로통',
		category: 'mouth',
		svg: () => `
			<ellipse cx="64" cy="58" rx="3" ry="2" fill="#C08080" />
		`,
	},
];

// ========== BLUSH ==========
export const BLUSH_PARTS: IAvatarPart[] = [
	{
		id: 'blush_none',
		name: '없음',
		category: 'blush',
		svg: () => ``,
	},
	{
		id: 'blush_natural',
		name: '자연스러운',
		category: 'blush',
		svg: () => `
			<ellipse cx="44" cy="48" rx="5" ry="2.5" fill="#FFB0A0" opacity="0.25" />
			<ellipse cx="84" cy="48" rx="5" ry="2.5" fill="#FFB0A0" opacity="0.25" />
		`,
	},
];

// ========== HAIR FRONT ==========
// 머리 위치: cy=42, ry=28, 그래서 머리 상단 y=14
// 남녀 공용 + 남성 스타일 포함
export const HAIR_FRONT_PARTS: IAvatarPart[] = [
	{
		id: 'hair_front_crew',
		name: '크루컷',
		category: 'hair_front',
		svg: ({ hair }) => `
			<!-- 크루컷 - 이마 덮는 짧은 스타일 -->
			<path d="M40 38 Q40 20, 52 14 Q64 12, 76 14 Q88 20, 88 38 Q86 34, 64 32 Q42 34, 40 38" fill="${hair}" />
		`,
	},
	{
		id: 'hair_front_dandy',
		name: '댄디컷',
		category: 'hair_front',
		svg: ({ hair }) => `
			<!-- 댄디컷 - 클래식 신사 스타일 (얼굴 안쪽) -->
			<path d="M40 32 Q40 20, 52 14 Q64 12, 76 14 Q88 20, 88 32 Q86 24, 64 20 Q42 24, 40 32" fill="${hair}" />
			<!-- 가르마 -->
			<path d="M46 28 Q52 24, 58 26" stroke="${darken(hair, 0.08)}" stroke-width="1.5" fill="none" stroke-linecap="round" />
			<!-- 옆으로 넘긴 머리 -->
			<path d="M58 24 Q70 20, 84 26" stroke="${darken(hair, 0.05)}" stroke-width="1" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'hair_front_pomade',
		name: '포마드',
		category: 'hair_front',
		svg: ({ hair }) => `
			<!-- 포마드 - 뒤로 넘긴 볼륨 (얼굴 안쪽) -->
			<path d="M40 30 Q40 16, 52 10 Q64 8, 76 10 Q88 16, 88 30 Q86 20, 64 16 Q42 20, 40 30" fill="${hair}" />
			<!-- 볼륨감 -->
			<path d="M44 26 Q54 18, 64 18 Q74 18, 84 26" stroke="${darken(hair, 0.06)}" stroke-width="1.2" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'hair_front_regent',
		name: '리젠트',
		category: 'hair_front',
		svg: ({ hair }) => `
			<!-- 리젠트 - 앞머리 볼륨 (얼굴 안쪽) -->
			<path d="M40 32 Q40 14, 52 8 Q64 6, 76 8 Q88 14, 88 32 Q86 22, 64 18 Q42 22, 40 32" fill="${hair}" />
			<!-- 앞머리 올린 볼륨 -->
			<path d="M50 22 Q56 12, 64 10 Q72 12, 78 22" fill="${hair}" />
			<path d="M54 20 Q58 14, 64 12 Q70 14, 74 20" stroke="${darken(hair, 0.06)}" stroke-width="1" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'hair_front_twoblock',
		name: '투블럭',
		category: 'hair_front',
		svg: ({ hair }) => `
			<!-- 투블럭 - 넓고 볼륨감 있는 스타일 -->
			<path d="M38 38 Q38 16, 52 10 Q64 8, 76 10 Q90 16, 90 38 Q88 32, 64 30 Q40 32, 38 38" fill="${hair}" />
		`,
	},
	{
		id: 'hair_front_undercut',
		name: '언더컷',
		category: 'hair_front',
		svg: ({ hair }) => `
			<!-- 언더컷 - 넓고 한쪽으로 넘긴 스타일 -->
			<path d="M38 38 Q38 16, 52 10 Q64 8, 76 10 Q90 16, 90 34 Q86 28, 70 30 Q54 32, 38 38" fill="${hair}" />
		`,
	},
	{
		id: 'hair_front_spiky',
		name: '스파이키',
		category: 'hair_front',
		svg: ({ hair }) => `
			<!-- 스파이키 - 아래로 뾰족한 앞머리 -->
			<path d="M42 28 Q42 18, 54 12 Q64 10, 74 12 Q86 18, 86 28" fill="${hair}" />
			<!-- 아래로 뾰족하게 내려오는 머리 -->
			<path d="M42 28 L48 38 L52 28 L58 40 L64 30 L70 42 L76 30 L82 38 L86 28" fill="${hair}" />
		`,
	},
];

// ========== HAIR BACK ==========
// 머리 위치: cy=42, ry=28 - 남성 스타일 중심
export const HAIR_BACK_PARTS: IAvatarPart[] = [
	{
		id: 'hair_back_buzz',
		name: '버즈컷',
		category: 'hair_back',
		svg: ({ hair }) => `
			<!-- 버즈컷 - 아주 짧은 밀리터리 (귀 위에서 끝남) -->
			<path d="M38 42 Q36 28, 48 18 Q58 12, 64 12 Q70 12, 80 18 Q92 28, 90 42 Q88 32, 78 24 Q68 18, 64 18 Q60 18, 50 24 Q40 32, 38 42" fill="${hair}" />
		`,
	},
	{
		id: 'hair_back_short',
		name: '숏컷',
		category: 'hair_back',
		svg: ({ hair }) => `
			<!-- 숏컷 - 기본 짧은 머리 (귀 위에서 끝남) -->
			<path d="M36 44 Q34 26, 46 16 Q56 10, 64 10 Q72 10, 82 16 Q94 26, 92 44 Q90 32, 80 22 Q70 14, 64 14 Q58 14, 48 22 Q38 32, 36 44" fill="${hair}" />
		`,
	},
	{
		id: 'hair_back_taper',
		name: '테이퍼',
		category: 'hair_back',
		svg: ({ hair }) => `
			<!-- 테이퍼컷 - 뒤로 갈수록 짧아지는 스타일 (귀 위) -->
			<path d="M38 40 Q36 24, 50 14 Q60 8, 64 8 Q68 8, 78 14 Q92 24, 90 40 Q88 28, 76 20 Q66 14, 64 14 Q62 14, 52 20 Q40 28, 38 40" fill="${hair}" />
		`,
	},
	{
		id: 'hair_back_fade',
		name: '페이드',
		category: 'hair_back',
		svg: ({ hair }) => `
			<!-- 페이드 - 옆과 뒤 그라데이션 (귀 위) -->
			<path d="M40 38 Q38 22, 52 14 Q62 8, 64 8 Q66 8, 76 14 Q90 22, 88 38 Q86 26, 74 18 Q66 12, 64 12 Q62 12, 54 18 Q42 26, 40 38" fill="${hair}" />
		`,
	},
	{
		id: 'hair_back_twoblock',
		name: '투블럭',
		category: 'hair_back',
		svg: ({ hair }) => `
			<!-- 투블럭 - 옆 밀고 위 볼륨 (귀 위) -->
			<path d="M42 36 Q40 22, 54 14 Q64 10, 74 14 Q88 22, 86 36 Q84 26, 72 20 Q64 18, 56 20 Q44 26, 42 36" fill="${hair}" />
		`,
	},
	{
		id: 'hair_back_undercut',
		name: '언더컷',
		category: 'hair_back',
		svg: ({ hair }) => `
			<!-- 언더컷 - 옆/뒤 밀고 윗부분만 (귀 위) -->
			<path d="M44 34 Q42 22, 56 14 Q64 10, 72 14 Q86 22, 84 34 Q82 24, 70 18 Q64 16, 58 18 Q46 24, 44 34" fill="${hair}" />
		`,
	},
	{
		id: 'hair_back_slick',
		name: '슬릭백',
		category: 'hair_back',
		svg: ({ hair }) => `
			<!-- 슬릭백 - 뒤로 넘긴 스타일 (귀 위) -->
			<path d="M36 44 Q34 24, 50 14 Q60 8, 64 8 Q68 8, 78 14 Q94 24, 92 44 Q90 32, 78 20 Q68 12, 64 12 Q60 12, 50 20 Q38 32, 36 44" fill="${hair}" />
			<!-- 뒤로 넘긴 결 표현 -->
			<path d="M46 32 Q54 26, 64 26 Q74 26, 82 32" stroke="${darken(hair, 0.05)}" stroke-width="1" fill="none" stroke-linecap="round" />
		`,
	},
];

// ========== OUTFIT BACK ==========
export const OUTFIT_BACK_PARTS: IAvatarPart[] = [
	{
		id: 'outfit_back_none',
		name: '없음',
		category: 'outfit_back',
		svg: () => '',
	},
];

// ========== OUTFIT FRONT ==========
// 몸 위치: 목 y=68, 어깨 y=76 - 팔은 어깨에서 자연스럽게 내려옴
export const OUTFIT_FRONT_PARTS: IAvatarPart[] = [
	{
		id: 'outfit_tshirt',
		name: '티셔츠',
		category: 'outfit_front',
		svg: ({ outfit }) => `
			<!-- 몸통 -->
			<path d="M32 76 L32 128 L96 128 L96 76 Q86 74 64 74 Q42 74 32 76" fill="${outfit}" />
			<!-- 왼쪽 어깨 + 소매 (어깨에서 자연스럽게 이어짐) -->
			<path d="M32 76 L22 80 L18 128 L32 128 Z" fill="${outfit}" />
			<path d="M22 80 L10 84 L6 128 L18 128 Z" fill="${outfit}" />
			<!-- 오른쪽 어깨 + 소매 -->
			<path d="M96 76 L106 80 L110 128 L96 128 Z" fill="${outfit}" />
			<path d="M106 80 L118 84 L122 128 L110 128 Z" fill="${outfit}" />
			<!-- 목 라인 -->
			<path d="M52 74 Q64 70 76 74" stroke="${darken(outfit, 0.1)}" stroke-width="2" fill="none" stroke-linecap="round" />
		`,
	},
	{
		id: 'outfit_hoodie',
		name: '후드티',
		category: 'outfit_front',
		svg: ({ outfit }) => `
			<!-- 후드 (뒤쪽 - 목 뒤로 보이는 부분) -->
			<path d="M40 66 Q50 60 64 60 Q78 60 88 66 Q92 70 88 74 L40 74 Q36 70 40 66" fill="${darken(outfit, 0.08)}" />
			<!-- 몸통 -->
			<path d="M30 76 L30 128 L98 128 L98 76 Q88 72 64 72 Q40 72 30 76" fill="${outfit}" />
			<!-- 왼쪽 어깨 + 소매 -->
			<path d="M30 76 L20 80 L16 128 L30 128 Z" fill="${outfit}" />
			<path d="M20 80 L8 84 L4 128 L16 128 Z" fill="${outfit}" />
			<!-- 오른쪽 어깨 + 소매 -->
			<path d="M98 76 L108 80 L112 128 L98 128 Z" fill="${outfit}" />
			<path d="M108 80 L120 84 L124 128 L112 128 Z" fill="${outfit}" />
			<!-- 후드 끈 -->
			<path d="M48 74 L46 92" stroke="${darken(outfit, 0.1)}" stroke-width="2" stroke-linecap="round" />
			<path d="M80 74 L82 92" stroke="${darken(outfit, 0.1)}" stroke-width="2" stroke-linecap="round" />
			<!-- 주머니 -->
			<path d="M44 102 Q64 98 84 102 L86 128 L42 128 Z" fill="${darken(outfit, 0.05)}" />
			<path d="M44 102 Q64 98 84 102" stroke="${darken(outfit, 0.1)}" stroke-width="1" fill="none" />
		`,
	},
	{
		id: 'outfit_shirt',
		name: '셔츠',
		category: 'outfit_front',
		svg: ({ outfit }) => `
			<!-- 몸통 -->
			<path d="M32 76 L32 128 L96 128 L96 76 Q86 72 64 72 Q42 72 32 76" fill="${outfit}" />
			<!-- 왼쪽 어깨 + 소매 -->
			<path d="M32 76 L22 80 L18 128 L32 128 Z" fill="${outfit}" />
			<path d="M22 80 L10 84 L6 128 L18 128 Z" fill="${outfit}" />
			<!-- 오른쪽 어깨 + 소매 -->
			<path d="M96 76 L106 80 L110 128 L96 128 Z" fill="${outfit}" />
			<path d="M106 80 L118 84 L122 128 L110 128 Z" fill="${outfit}" />
			<!-- 칼라 -->
			<path d="M50 72 L56 88 L64 78 L72 88 L78 72" fill="${lighten(outfit, 0.06)}" />
			<path d="M50 72 L56 88 L64 78" stroke="${darken(outfit, 0.08)}" stroke-width="0.5" fill="none" />
			<path d="M78 72 L72 88 L64 78" stroke="${darken(outfit, 0.08)}" stroke-width="0.5" fill="none" />
			<!-- 단추 라인 -->
			<line x1="64" y1="88" x2="64" y2="128" stroke="${darken(outfit, 0.06)}" stroke-width="1" />
			<circle cx="64" cy="96" r="1.5" fill="${darken(outfit, 0.08)}" />
			<circle cx="64" cy="108" r="1.5" fill="${darken(outfit, 0.08)}" />
			<circle cx="64" cy="120" r="1.5" fill="${darken(outfit, 0.08)}" />
		`,
	},
	{
		id: 'outfit_jacket',
		name: '자켓',
		category: 'outfit_front',
		svg: ({ outfit }) => `
			<!-- 이너 티셔츠 -->
			<path d="M46 74 Q64 70 82 74 L82 128 L46 128 Z" fill="#E0E0E0" />
			<!-- 자켓 몸통 -->
			<path d="M30 76 L46 74 L46 128 L30 128 Z" fill="${outfit}" />
			<path d="M98 76 L82 74 L82 128 L98 128 Z" fill="${outfit}" />
			<!-- 왼쪽 어깨 + 소매 -->
			<path d="M30 76 L18 80 L14 128 L30 128 Z" fill="${outfit}" />
			<path d="M18 80 L4 84 L0 128 L14 128 Z" fill="${outfit}" />
			<!-- 오른쪽 어깨 + 소매 -->
			<path d="M98 76 L110 80 L114 128 L98 128 Z" fill="${outfit}" />
			<path d="M110 80 L124 84 L128 128 L114 128 Z" fill="${outfit}" />
			<!-- 칼라 -->
			<path d="M46 74 L50 88 L58 78" fill="${darken(outfit, 0.05)}" />
			<path d="M82 74 L78 88 L70 78" fill="${darken(outfit, 0.05)}" />
			<!-- 지퍼/라인 -->
			<line x1="46" y1="74" x2="46" y2="128" stroke="${darken(outfit, 0.12)}" stroke-width="1" />
			<line x1="82" y1="74" x2="82" y2="128" stroke="${darken(outfit, 0.12)}" stroke-width="1" />
		`,
	},
	{
		id: 'outfit_sweater',
		name: '스웨터',
		category: 'outfit_front',
		svg: ({ outfit }) => `
			<!-- 몸통 -->
			<path d="M30 76 L30 128 L98 128 L98 76 Q88 72 64 72 Q40 72 30 76" fill="${outfit}" />
			<!-- 왼쪽 어깨 + 소매 -->
			<path d="M30 76 L18 80 L14 128 L30 128 Z" fill="${outfit}" />
			<path d="M18 80 L4 84 L0 128 L14 128 Z" fill="${outfit}" />
			<!-- 오른쪽 어깨 + 소매 -->
			<path d="M98 76 L110 80 L114 128 L98 128 Z" fill="${outfit}" />
			<path d="M110 80 L124 84 L128 128 L114 128 Z" fill="${outfit}" />
			<!-- 목 -->
			<path d="M50 72 Q64 66 78 72" stroke="${darken(outfit, 0.08)}" stroke-width="4" fill="none" stroke-linecap="round" />
			<!-- 소매 끝단 -->
			<rect x="0" y="124" width="14" height="4" rx="1" fill="${darken(outfit, 0.1)}" />
			<rect x="114" y="124" width="14" height="4" rx="1" fill="${darken(outfit, 0.1)}" />
			<!-- 밑단 -->
			<rect x="30" y="122" width="68" height="6" rx="1" fill="${darken(outfit, 0.05)}" />
		`,
	},
	{
		id: 'outfit_cardigan',
		name: '가디건',
		category: 'outfit_front',
		svg: ({ outfit }) => `
			<!-- 이너 티셔츠 -->
			<path d="M50 74 Q64 70 78 74 L78 128 L50 128 Z" fill="#E8E8E8" />
			<path d="M54 74 L64 88 L74 74" stroke="#CCCCCC" stroke-width="0.5" fill="none" />
			<!-- 가디건 앞판 -->
			<path d="M32 78 L50 74 L50 128 L32 128 Z" fill="${outfit}" />
			<path d="M96 78 L78 74 L78 128 L96 128 Z" fill="${outfit}" />
			<!-- 왼쪽 어깨 + 소매 -->
			<path d="M32 78 L20 82 L16 128 L32 128 Z" fill="${outfit}" />
			<path d="M20 82 L6 86 L2 128 L16 128 Z" fill="${outfit}" />
			<!-- 오른쪽 어깨 + 소매 -->
			<path d="M96 78 L108 82 L112 128 L96 128 Z" fill="${outfit}" />
			<path d="M108 82 L122 86 L126 128 L112 128 Z" fill="${outfit}" />
			<!-- 가디건 라인 -->
			<line x1="50" y1="74" x2="50" y2="128" stroke="${darken(outfit, 0.1)}" stroke-width="1" />
			<line x1="78" y1="74" x2="78" y2="128" stroke="${darken(outfit, 0.1)}" stroke-width="1" />
			<!-- 단추 -->
			<circle cx="50" cy="90" r="2" fill="${darken(outfit, 0.12)}" />
			<circle cx="50" cy="106" r="2" fill="${darken(outfit, 0.12)}" />
		`,
	},
];

// ========== ACCESSORY ==========
// 눈 위치: y=40
export const ACCESSORY_PARTS: IAvatarPart[] = [
	{
		id: 'acc_none',
		name: '없음',
		category: 'accessory',
		svg: () => '',
	},
	{
		id: 'acc_glasses_round',
		name: '동그란 안경',
		category: 'accessory',
		svg: () => `
			<circle cx="52" cy="40" r="9" fill="none" stroke="#2A2A3A" stroke-width="1.5" />
			<circle cx="76" cy="40" r="9" fill="none" stroke="#2A2A3A" stroke-width="1.5" />
			<path d="M61 40 Q64 38 67 40" stroke="#2A2A3A" stroke-width="1.2" fill="none" />
			<line x1="43" y1="40" x2="38" y2="38" stroke="#2A2A3A" stroke-width="1.2" />
			<line x1="85" y1="40" x2="90" y2="38" stroke="#2A2A3A" stroke-width="1.2" />
		`,
	},
	{
		id: 'acc_glasses_square',
		name: '각진 안경',
		category: 'accessory',
		svg: () => `
			<rect x="43" y="34" width="16" height="12" rx="2" fill="none" stroke="#2A2A3A" stroke-width="1.5" />
			<rect x="69" y="34" width="16" height="12" rx="2" fill="none" stroke="#2A2A3A" stroke-width="1.5" />
			<path d="M59 40 L69 40" stroke="#2A2A3A" stroke-width="1.2" />
			<line x1="43" y1="38" x2="38" y2="36" stroke="#2A2A3A" stroke-width="1.2" />
			<line x1="85" y1="38" x2="90" y2="36" stroke="#2A2A3A" stroke-width="1.2" />
		`,
	},
	{
		id: 'acc_earrings',
		name: '귀걸이',
		category: 'accessory',
		svg: () => `
			<circle cx="38" cy="52" r="2.5" fill="#FFD700" />
			<circle cx="90" cy="52" r="2.5" fill="#FFD700" />
		`,
	},
];

// ========== EFFECT ==========
export const EFFECT_PARTS: IAvatarPart[] = [
	{
		id: 'effect_none',
		name: '없음',
		category: 'effect',
		svg: () => '',
	},
	{
		id: 'effect_sparkle',
		name: '반짝',
		category: 'effect',
		svg: () => `
			<path d="M20 20 L22 24 L26 24 L23 27 L24 31 L20 28 L16 31 L17 27 L14 24 L18 24 Z" fill="#FFD700" />
			<path d="M100 14 L101 16 L103 16 L101.5 17.5 L102 19 L100 17.5 L98 19 L98.5 17.5 L97 16 L99 16 Z" fill="#FFD700" />
			<path d="M108 28 L109 30 L111 30 L109.5 31.5 L110 33 L108 31.5 L106 33 L106.5 31.5 L105 30 L107 30 Z" fill="#FFD700" />
		`,
	},
];

// ========== BACKGROUND ==========
export const BACKGROUND_PARTS: IAvatarPart[] = [
	{
		id: 'bg_none',
		name: '없음',
		category: 'background',
		svg: () => '',
	},
	{
		id: 'bg_circle',
		name: '원형',
		category: 'background',
		svg: () => `
			<circle cx="64" cy="64" r="62" fill="#E8F4F8" />
		`,
	},
	{
		id: 'bg_gradient_blue',
		name: '블루',
		category: 'background',
		svg: () => `
			<defs>
				<linearGradient id="bgGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#E0F2FE" />
					<stop offset="100%" stop-color="#BAE6FD" />
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="128" height="128" fill="url(#bgGradBlue)" />
		`,
	},
	{
		id: 'bg_gradient_purple',
		name: '퍼플',
		category: 'background',
		svg: () => `
			<defs>
				<linearGradient id="bgGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#F3E8FF" />
					<stop offset="100%" stop-color="#E9D5FF" />
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="128" height="128" fill="url(#bgGradPurple)" />
		`,
	},
	{
		id: 'bg_gradient_warm',
		name: '웜',
		category: 'background',
		svg: () => `
			<defs>
				<linearGradient id="bgGradWarm" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#FEF3C7" />
					<stop offset="100%" stop-color="#FDE68A" />
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="128" height="128" fill="url(#bgGradWarm)" />
		`,
	},
];

// 의상 색상
export const OUTFIT_COLORS = {
	charcoal: '#2D2D3A',
	navy: '#1E3A5F',
	forest: '#2D4A3E',
	burgundy: '#5A2D3D',
	slate: '#4A5568',
	cream: '#F5F0E8',
	sage: '#87A08B',
	dustyRose: '#C9A9A6',
	ocean: '#3A6B8C',
	lavender: '#8B7BA8',
	terracotta: '#C17C60',
	olive: '#6B7B50',
} as const;

export type OutfitColor = keyof typeof OUTFIT_COLORS;

// ========== ALL_PARTS 통합 객체 ==========
export const ALL_PARTS = {
	background: BACKGROUND_PARTS,
	hair_back: HAIR_BACK_PARTS,
	body: BODY_PARTS,
	outfit_back: OUTFIT_BACK_PARTS,
	head: HEAD_PARTS,
	ears: EARS_PARTS,
	face_shadow: FACE_SHADOW_PARTS,
	eyes: EYE_PARTS,
	eyebrows: EYEBROW_PARTS,
	nose: NOSE_PARTS,
	mouth: MOUTH_PARTS,
	blush: BLUSH_PARTS,
	hair_front: HAIR_FRONT_PARTS,
	outfit_front: OUTFIT_FRONT_PARTS,
	accessory: ACCESSORY_PARTS,
	effect: EFFECT_PARTS,
} as const;

// ========== Avatar Config ==========
export interface AvatarConfig {
	skinTone: SkinTone;
	hairColor: HairColor;
	eyeColor: EyeColor;
	outfitColor: string;
	parts: {
		background?: string;
		hair_back?: string;
		body?: string;
		outfit_back?: string;
		head?: string;
		ears?: string;
		face_shadow?: string;
		eyes?: string;
		eyebrows?: string;
		nose?: string;
		mouth?: string;
		blush?: string;
		hair_front?: string;
		outfit_front?: string;
		accessory?: string;
		effect?: string;
	};
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
	skinTone: 'fair',
	hairColor: 'brown',
	eyeColor: 'brown',
	outfitColor: OUTFIT_COLORS.navy,
	parts: {
		background: 'bg_none',
		hair_back: 'hair_back_short',
		body: 'body_default',
		outfit_back: 'outfit_back_none',
		head: 'head_default',
		ears: 'ears_default',
		face_shadow: 'face_shadow_default',
		eyes: 'eyes_default',
		eyebrows: 'eyebrows_natural',
		nose: 'nose_small',
		mouth: 'mouth_smile',
		blush: 'blush_none',
		hair_front: 'hair_front_crew',
		outfit_front: 'outfit_tshirt',
		accessory: 'acc_none',
		effect: 'effect_none',
	},
};
