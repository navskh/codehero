/**
 * LayeredAvatar Component
 * 메이플스토리 스타일 Zmap 기반 레이어 아바타
 */

import { useMemo } from 'react';
import {
	ZMAP_ORDER,
	SKIN_TONES,
	HAIR_COLORS,
	EYE_COLORS,
	ALL_PARTS,
	DEFAULT_AVATAR_CONFIG,
	type AvatarConfig,
	type IAvatarColors,
	type ZmapLayer,
} from '../../data/avatar/parts';

interface ILayeredAvatarProps {
	/** 아바타 설정 */
	config?: Partial<AvatarConfig>;
	/** 크기 (px) */
	size?: number;
	/** 추가 클래스 */
	className?: string;
	/** 애니메이션 */
	animated?: boolean;
}

/**
 * Zmap 기반 레이어 아바타
 */
export function LayeredAvatar({
	config,
	size = 128,
	className = '',
	animated = true,
}: ILayeredAvatarProps) {
	// 설정 병합
	const mergedConfig = useMemo(() => {
		return {
			...DEFAULT_AVATAR_CONFIG,
			...config,
			parts: {
				...DEFAULT_AVATAR_CONFIG.parts,
				...config?.parts,
			},
		};
	}, [config]);

	// 색상 정보
	const colors: IAvatarColors = useMemo(() => ({
		skin: SKIN_TONES[mergedConfig.skinTone] || SKIN_TONES.fair,
		hair: HAIR_COLORS[mergedConfig.hairColor] || HAIR_COLORS.brown,
		eyes: EYE_COLORS[mergedConfig.eyeColor] || EYE_COLORS.brown,
		outfit: mergedConfig.outfitColor,
	}), [mergedConfig]);

	// SVG 렌더링
	const svgContent = useMemo(() => {
		const layers: string[] = [];

		// Zmap 순서대로 레이어 렌더링
		for (const layer of ZMAP_ORDER) {
			const partId = mergedConfig.parts[layer as keyof typeof mergedConfig.parts];
			if (!partId) continue;

			const partsArray = ALL_PARTS[layer as keyof typeof ALL_PARTS];
			if (!partsArray) continue;

			const part = partsArray.find((p) => p.id === partId);
			if (!part) continue;

			const svgStr = part.svg(colors);
			if (svgStr) {
				layers.push(`<g data-layer="${layer}">${svgStr}</g>`);
			}
		}

		return layers.join('\n');
	}, [mergedConfig, colors]);

	const fullSvg = `
		<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
			${svgContent}
		</svg>
	`;

	return (
		<div
			className={`relative ${animated ? 'animate-float' : ''} ${className}`}
			style={{ width: size, height: size }}
			dangerouslySetInnerHTML={{ __html: fullSvg }}
		/>
	);
}

/**
 * 파츠 선택 프리뷰 컴포넌트
 */
interface IPartPreviewProps {
	layer: ZmapLayer;
	partId: string;
	colors: IAvatarColors;
	size?: number;
	selected?: boolean;
	onClick?: () => void;
}

export function PartPreview({
	layer,
	partId,
	colors,
	size: _size = 64,
	selected = false,
	onClick,
}: IPartPreviewProps) {
	const svgContent = useMemo(() => {
		const partsArray = ALL_PARTS[layer as keyof typeof ALL_PARTS];
		if (!partsArray) return '';

		const part = partsArray.find((p) => p.id === partId);
		if (!part) return '';

		return part.svg(colors);
	}, [layer, partId, colors]);

	// 빈 파츠인 경우
	if (!svgContent) {
		return (
			<button
				onClick={onClick}
				className={`w-full aspect-square rounded-xl bg-[rgba(0,0,0,0.3)] flex items-center justify-center transition-all ${
					selected
						? 'ring-2 ring-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]'
						: 'hover:bg-[rgba(0,0,0,0.4)]'
				}`}
			>
				<span className="text-2xl opacity-50">✕</span>
			</button>
		);
	}

	const fullSvg = `
		<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
			<g>${svgContent}</g>
		</svg>
	`;

	return (
		<button
			onClick={onClick}
			className={`w-full aspect-square rounded-xl bg-[rgba(0,0,0,0.3)] p-2 transition-all ${
				selected
					? 'ring-2 ring-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]'
					: 'hover:bg-[rgba(0,0,0,0.4)]'
			}`}
		>
			<div
				style={{ width: '100%', height: '100%' }}
				dangerouslySetInnerHTML={{ __html: fullSvg }}
			/>
		</button>
	);
}

/**
 * 색상 선택 버튼
 */
interface IColorButtonProps {
	color: string;
	selected?: boolean;
	onClick?: () => void;
	size?: number;
}

export function ColorButton({
	color,
	selected = false,
	onClick,
	size = 32,
}: IColorButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`rounded-full transition-all ${
				selected
					? 'ring-2 ring-[#00d4ff] ring-offset-2 ring-offset-[#1a1a2e] scale-110'
					: 'hover:scale-105'
			}`}
			style={{
				width: size,
				height: size,
				backgroundColor: color,
				boxShadow: selected ? `0 0 15px ${color}` : 'none',
			}}
		/>
	);
}

export default LayeredAvatar;
