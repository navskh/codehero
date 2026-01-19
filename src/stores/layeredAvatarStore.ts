import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
	DEFAULT_AVATAR_CONFIG,
	type AvatarConfig,
	type SkinTone,
	type HairColor,
	type EyeColor,
} from '../data/avatar/parts';

// 최대 히스토리 크기
const MAX_HISTORY_SIZE = 20;

interface ILayeredAvatarStore {
	config: AvatarConfig;

	// 히스토리
	past: AvatarConfig[];
	future: AvatarConfig[];

	// Computed
	canUndo: boolean;
	canRedo: boolean;

	// Actions
	setConfig: (config: Partial<AvatarConfig>) => void;
	setSkinTone: (tone: SkinTone) => void;
	setHairColor: (color: HairColor) => void;
	setEyeColor: (color: EyeColor) => void;
	setOutfitColor: (color: string) => void;
	setPart: (layer: string, partId: string | null) => void;
	randomize: () => void;
	reset: () => void;

	// History Actions
	undo: () => void;
	redo: () => void;
	clearHistory: () => void;

	// Preset Actions
	applyPreset: (config: AvatarConfig) => void;
}

// 히스토리에 현재 상태 저장하는 헬퍼 함수
const pushToHistory = (
	past: AvatarConfig[],
	current: AvatarConfig
): AvatarConfig[] => {
	const newPast = [...past, current];
	// 최대 크기 초과 시 오래된 항목 제거
	if (newPast.length > MAX_HISTORY_SIZE) {
		return newPast.slice(-MAX_HISTORY_SIZE);
	}
	return newPast;
};

export const useLayeredAvatarStore = create<ILayeredAvatarStore>()(
	persist(
		(set, get) => ({
			config: DEFAULT_AVATAR_CONFIG,
			past: [],
			future: [],
			canUndo: false,
			canRedo: false,

			setConfig: (newConfig) => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [], // 새 변경 시 future 초기화
					config: {
						...state.config,
						...newConfig,
						parts: {
							...state.config.parts,
							...newConfig.parts,
						},
					},
					canUndo: true,
					canRedo: false,
				}));
			},

			setSkinTone: (tone) => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [],
					config: { ...state.config, skinTone: tone },
					canUndo: true,
					canRedo: false,
				}));
			},

			setHairColor: (color) => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [],
					config: { ...state.config, hairColor: color },
					canUndo: true,
					canRedo: false,
				}));
			},

			setEyeColor: (color) => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [],
					config: { ...state.config, eyeColor: color },
					canUndo: true,
					canRedo: false,
				}));
			},

			setOutfitColor: (color) => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [],
					config: { ...state.config, outfitColor: color },
					canUndo: true,
					canRedo: false,
				}));
			},

			setPart: (layer, partId) => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [],
					config: {
						...state.config,
						parts: {
							...state.config.parts,
							[layer]: partId,
						},
					},
					canUndo: true,
					canRedo: false,
				}));
			},

			randomize: () => {
				// 랜덤 로직은 Avatar 페이지에서 처리
			},

			reset: () => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [],
					config: DEFAULT_AVATAR_CONFIG,
					canUndo: true,
					canRedo: false,
				}));
			},

			// Undo - 이전 상태로 복원
			undo: () => {
				const { past, config, future } = get();
				if (past.length === 0) return;

				const previous = past[past.length - 1];
				const newPast = past.slice(0, -1);

				set({
					past: newPast,
					config: previous,
					future: [config, ...future],
					canUndo: newPast.length > 0,
					canRedo: true,
				});
			},

			// Redo - 취소한 작업 다시 실행
			redo: () => {
				const { past, config, future } = get();
				if (future.length === 0) return;

				const next = future[0];
				const newFuture = future.slice(1);

				set({
					past: [...past, config],
					config: next,
					future: newFuture,
					canUndo: true,
					canRedo: newFuture.length > 0,
				});
			},

			// 히스토리 전체 초기화
			clearHistory: () => {
				set({
					past: [],
					future: [],
					canUndo: false,
					canRedo: false,
				});
			},

			// 프리셋 적용
			applyPreset: (presetConfig) => {
				const currentConfig = get().config;
				set((state) => ({
					past: pushToHistory(state.past, currentConfig),
					future: [],
					config: presetConfig,
					canUndo: true,
					canRedo: false,
				}));
			},
		}),
		{
			name: 'codehero-layered-avatar',
			partialize: (state) => ({
				config: state.config,
				// 히스토리는 저장하지 않음 (세션별 관리)
			}),
		}
	)
);
