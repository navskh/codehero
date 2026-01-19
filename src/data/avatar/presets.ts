/**
 * Avatar Presets
 * 기본 프리셋 5개 + 사용자 프리셋 관리
 */

import { type AvatarConfig, OUTFIT_COLORS } from './parts';

export interface IAvatarPreset {
	id: string;
	name: string;
	description: string;
	config: AvatarConfig;
	isDefault?: boolean;
}

// 기본 프리셋 5개
export const DEFAULT_PRESETS: IAvatarPreset[] = [
	{
		id: 'preset_default',
		name: '기본',
		description: '깔끔한 기본 스타일',
		isDefault: true,
		config: {
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
		},
	},
	{
		id: 'preset_professional',
		name: '프로페셔널',
		description: '비즈니스 정장 스타일',
		isDefault: true,
		config: {
			skinTone: 'light',
			hairColor: 'darkBrown',
			eyeColor: 'brown',
			outfitColor: OUTFIT_COLORS.charcoal,
			parts: {
				background: 'bg_gradient_blue',
				hair_back: 'hair_back_slick',
				body: 'body_default',
				outfit_back: 'outfit_back_none',
				head: 'head_default',
				ears: 'ears_default',
				face_shadow: 'face_shadow_default',
				eyes: 'eyes_default',
				eyebrows: 'eyebrows_straight',
				nose: 'nose_line',
				mouth: 'mouth_neutral',
				blush: 'blush_none',
				hair_front: 'hair_front_dandy',
				outfit_front: 'outfit_jacket',
				accessory: 'acc_glasses_square',
				effect: 'effect_none',
			},
		},
	},
	{
		id: 'preset_casual',
		name: '캐주얼',
		description: '편안한 일상 스타일',
		isDefault: true,
		config: {
			skinTone: 'medium',
			hairColor: 'auburn',
			eyeColor: 'hazel',
			outfitColor: OUTFIT_COLORS.sage,
			parts: {
				background: 'bg_gradient_warm',
				hair_back: 'hair_back_taper',
				body: 'body_default',
				outfit_back: 'outfit_back_none',
				head: 'head_default',
				ears: 'ears_default',
				face_shadow: 'face_shadow_default',
				eyes: 'eyes_round',
				eyebrows: 'eyebrows_natural',
				nose: 'nose_round',
				mouth: 'mouth_grin',
				blush: 'blush_none',
				hair_front: 'hair_front_pomade',
				outfit_front: 'outfit_hoodie',
				accessory: 'acc_none',
				effect: 'effect_none',
			},
		},
	},
	{
		id: 'preset_gamer',
		name: '게이머',
		description: '트렌디한 게이머 스타일',
		isDefault: true,
		config: {
			skinTone: 'fair',
			hairColor: 'blue',
			eyeColor: 'blue',
			outfitColor: '#2D3748',
			parts: {
				background: 'bg_gradient_purple',
				hair_back: 'hair_back_twoblock',
				body: 'body_default',
				outfit_back: 'outfit_back_none',
				head: 'head_default',
				ears: 'ears_default',
				face_shadow: 'face_shadow_default',
				eyes: 'eyes_narrow',
				eyebrows: 'eyebrows_arched',
				nose: 'nose_small',
				mouth: 'mouth_smile',
				blush: 'blush_none',
				hair_front: 'hair_front_twoblock',
				outfit_front: 'outfit_tshirt',
				accessory: 'acc_none',
				effect: 'effect_sparkle',
			},
		},
	},
	{
		id: 'preset_developer',
		name: '개발자',
		description: '실용적인 개발자 스타일',
		isDefault: true,
		config: {
			skinTone: 'light',
			hairColor: 'black',
			eyeColor: 'brown',
			outfitColor: OUTFIT_COLORS.slate,
			parts: {
				background: 'bg_circle',
				hair_back: 'hair_back_fade',
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
				hair_front: 'hair_front_undercut',
				outfit_front: 'outfit_hoodie',
				accessory: 'acc_glasses_round',
				effect: 'effect_none',
			},
		},
	},
];

// 색상명 매핑
export const SKIN_TONE_NAMES: Record<string, string> = {
	fair: '페어',
	light: '라이트',
	medium: '미디엄',
	tan: '탠',
	brown: '브라운',
	dark: '다크',
};

export const HAIR_COLOR_NAMES: Record<string, string> = {
	black: '블랙',
	darkBrown: '다크 브라운',
	brown: '브라운',
	auburn: '오번',
	blonde: '블론드',
	platinum: '플래티넘',
	gray: '그레이',
	blue: '블루',
	purple: '퍼플',
	pink: '핑크',
};

export const EYE_COLOR_NAMES: Record<string, string> = {
	black: '블랙',
	brown: '브라운',
	hazel: '헤이즐',
	blue: '블루',
	green: '그린',
	gray: '그레이',
};

export const OUTFIT_COLOR_NAMES: Record<string, string> = {
	'#1C1C27': '미드나잇',
	'#2D3748': '슬레이트',
	'#4A5568': '쿨그레이',
	'#5B7C99': '스틸블루',
	'#3182CE': '로얄블루',
	'#319795': '틸',
	'#38A169': '에메랄드',
	'#805AD5': '바이올렛',
	'#B83280': '마젠타',
	'#C53030': '크림슨',
	'#DD6B20': '탠저린',
	'#D69E2E': '골든',
	'#718096': '뉴트럴',
	'#F7FAFC': '화이트',
};

// 사용자 프리셋 localStorage 키
const USER_PRESETS_KEY = 'codehero-user-avatar-presets';
const MAX_USER_PRESETS = 5;

// 사용자 프리셋 저장
export function saveUserPreset(
	name: string,
	config: AvatarConfig
): IAvatarPreset | null {
	const userPresets = getUserPresets();

	if (userPresets.length >= MAX_USER_PRESETS) {
		return null; // 최대 개수 초과
	}

	const newPreset: IAvatarPreset = {
		id: `user_preset_${Date.now()}`,
		name,
		description: '사용자 프리셋',
		isDefault: false,
		config,
	};

	userPresets.push(newPreset);
	localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(userPresets));

	return newPreset;
}

// 사용자 프리셋 불러오기
export function getUserPresets(): IAvatarPreset[] {
	try {
		const stored = localStorage.getItem(USER_PRESETS_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

// 사용자 프리셋 삭제
export function deleteUserPreset(presetId: string): boolean {
	const userPresets = getUserPresets();
	const filtered = userPresets.filter((p) => p.id !== presetId);

	if (filtered.length === userPresets.length) {
		return false; // 삭제할 프리셋 없음
	}

	localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(filtered));
	return true;
}

// 모든 프리셋 가져오기 (기본 + 사용자)
export function getAllPresets(): IAvatarPreset[] {
	return [...DEFAULT_PRESETS, ...getUserPresets()];
}
