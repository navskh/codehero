/**
 * Canvas-based Pixel Avatar Component
 *
 * box-shadow 대신 Canvas를 사용한 고성능 아바타 렌더러
 * 기존 PixelAvatar의 개선 버전
 */

import { useRef, useEffect, useMemo } from 'react';
import { useAvatarStore } from '../../stores';
import {
	AVATAR_SIZE_MAP,
	PIXEL_GRID_SIZE,
	SKIN_PALETTE,
	HAIR_PALETTE,
	EYE_COLORS,
	MISC_COLORS,
	OUTFIT_COLORS,
	type AvatarSize,
} from '../../data/avatar/constants';
import {
	BASE_BODY_SPRITE,
	HAIR_VARIANTS,
	GLASSES_OVERLAY,
	type PixelCode,
} from '../../data/avatar/sprites/baseSprite';

interface ICanvasAvatarProps {
	size?: AvatarSize | number;
	animated?: boolean;
	className?: string;
}

/**
 * 스프라이트에 헤어 스타일 적용
 */
function applyHairStyle(
	pixels: PixelCode[][],
	hairStyle: string
): PixelCode[][] {
	const result = pixels.map((row) => [...row]);

	if (hairStyle === 'hair_messy' && HAIR_VARIANTS.hair_messy) {
		HAIR_VARIANTS.hair_messy.forEach((variantRow, rowIndex) => {
			if (variantRow && result[rowIndex]) {
				variantRow.forEach((pixel, colIndex) => {
					if (pixel !== undefined) {
						result[rowIndex][colIndex] = pixel as PixelCode;
					}
				});
			}
		});
	} else if (hairStyle === 'hair_long') {
		// 긴 머리 - 양옆으로 내려옴
		for (let i = 5; i <= 17; i++) {
			if (result[i]) {
				result[i][5] = '1';
				result[i][22] = '1';
			}
		}
	}

	return result;
}

/**
 * 안경 오버레이 적용
 */
function applyGlasses(pixels: PixelCode[][]): PixelCode[][] {
	const result = pixels.map((row) => [...row]);

	GLASSES_OVERLAY.forEach(({ row, cols }) => {
		if (result[row]) {
			cols.forEach((col) => {
				result[row][col] = '7';
			});
		}
	});

	return result;
}

/**
 * Canvas에 아바타 렌더링
 */
function renderAvatar(
	ctx: CanvasRenderingContext2D,
	pixels: PixelCode[][],
	colorMap: Record<string, string>,
	scale: number
): void {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// 색상별로 픽셀 그룹화 (배치 렌더링 최적화)
	const colorGroups = new Map<string, Array<{ x: number; y: number }>>();

	pixels.forEach((row, y) => {
		row.forEach((pixel, x) => {
			if (pixel !== '0') {
				const color = colorMap[pixel];
				if (color && color !== 'transparent') {
					if (!colorGroups.has(color)) {
						colorGroups.set(color, []);
					}
					colorGroups.get(color)!.push({ x, y });
				}
			}
		});
	});

	// 색상별 배치 렌더링
	colorGroups.forEach((positions, color) => {
		ctx.fillStyle = color;
		positions.forEach(({ x, y }) => {
			ctx.fillRect(x * scale, y * scale, scale, scale);
		});
	});
}

export function CanvasAvatar({
	size = 'md',
	animated = true,
	className = '',
}: ICanvasAvatarProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | null>(null);
	const { avatar } = useAvatarStore();

	// 크기 계산
	const pixelSize = typeof size === 'number' ? size : AVATAR_SIZE_MAP[size];
	const scale = pixelSize / PIXEL_GRID_SIZE;

	// 색상 맵 생성
	const colorMap = useMemo(() => {
		const skinColor = SKIN_PALETTE[avatar.base.skinTone] || SKIN_PALETTE[0];
		const hairColor = HAIR_PALETTE[avatar.base.skinTone] || HAIR_PALETTE[0];
		const outfitColor =
			OUTFIT_COLORS[avatar.equipment.outfit || 'outfit_hoodie'] ||
			OUTFIT_COLORS.outfit_hoodie;

		return {
			'0': 'transparent',
			'1': hairColor,
			'2': skinColor,
			'3': EYE_COLORS.white,
			'4': EYE_COLORS.pupil,
			'5': EYE_COLORS.highlight,
			'6': outfitColor,
			'7': MISC_COLORS.glassesFrame,
			'8': MISC_COLORS.glasses,
			'9': MISC_COLORS.laptop,
			A: MISC_COLORS.laptopScreen,
			B: MISC_COLORS.blush,
			C: EYE_COLORS.highlight2,
			D: MISC_COLORS.mouth,
		};
	}, [avatar.base.skinTone, avatar.equipment.outfit]);

	// 픽셀 데이터 생성
	const pixels = useMemo(() => {
		let result = BASE_BODY_SPRITE.pixels.map((row) => [...row]);

		// 헤어 스타일 적용
		result = applyHairStyle(result, avatar.equipment.hair || 'hair_short_black');

		// 안경 적용
		const hasGlasses =
			!avatar.equipment.accessory || avatar.equipment.accessory === 'acc_glasses';
		if (hasGlasses) {
			result = applyGlasses(result);
		}

		return result;
	}, [avatar.equipment.hair, avatar.equipment.accessory]);

	// Canvas 렌더링
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// 픽셀 아트 스타일 설정
		ctx.imageSmoothingEnabled = false;

		// 렌더링
		renderAvatar(ctx, pixels, colorMap, scale);

		// 클린업
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [pixels, colorMap, scale]);

	// 플로팅 애니메이션 (CSS로 처리)
	return (
		<div
			className={`relative ${className}`}
			style={{
				width: pixelSize,
				height: pixelSize,
			}}
		>
			<canvas
				ref={canvasRef}
				width={pixelSize}
				height={pixelSize}
				className={animated ? 'animate-float' : ''}
				style={{
					imageRendering: 'pixelated',
				}}
			/>

			{/* 이펙트 오버레이 */}
			{avatar.equipment.effect === 'effect_sparkle' && (
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute top-2 right-3 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
					<div
						className="absolute top-4 left-2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping"
						style={{ animationDelay: '0.3s' }}
					/>
					<div
						className="absolute bottom-6 right-2 w-1 h-1 bg-pink-300 rounded-full animate-ping"
						style={{ animationDelay: '0.6s' }}
					/>
				</div>
			)}
			{avatar.equipment.effect === 'effect_flame' && (
				<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xl animate-bounce">
					🔥
				</div>
			)}
			{avatar.equipment.effect === 'effect_rainbow' && (
				<div
					className="absolute inset-0 rounded-full opacity-40 animate-pulse"
					style={{
						background:
							'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
						filter: 'blur(12px)',
					}}
				/>
			)}
		</div>
	);
}

/**
 * 정적 Canvas 아바타 (스토어 의존성 없음)
 */
export function StaticCanvasAvatar({
	skinTone = 0,
	hairStyle = 'hair_short_black',
	outfit = 'outfit_hoodie',
	hasGlasses = true,
	size = 'md',
	className = '',
}: {
	skinTone?: number;
	hairStyle?: string;
	outfit?: string;
	hasGlasses?: boolean;
	size?: AvatarSize | number;
	className?: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const pixelSize = typeof size === 'number' ? size : AVATAR_SIZE_MAP[size];
	const scale = pixelSize / PIXEL_GRID_SIZE;

	const colorMap = useMemo(() => {
		const skinColor = SKIN_PALETTE[skinTone] || SKIN_PALETTE[0];
		const hairColor = HAIR_PALETTE[skinTone] || HAIR_PALETTE[0];
		const outfitColor = OUTFIT_COLORS[outfit] || OUTFIT_COLORS.outfit_hoodie;

		return {
			'0': 'transparent',
			'1': hairColor,
			'2': skinColor,
			'3': EYE_COLORS.white,
			'4': EYE_COLORS.pupil,
			'5': EYE_COLORS.highlight,
			'6': outfitColor,
			'7': MISC_COLORS.glassesFrame,
			'8': MISC_COLORS.glasses,
			'9': MISC_COLORS.laptop,
			A: MISC_COLORS.laptopScreen,
			B: MISC_COLORS.blush,
			C: EYE_COLORS.highlight2,
			D: MISC_COLORS.mouth,
		};
	}, [skinTone, outfit]);

	const pixels = useMemo(() => {
		let result = BASE_BODY_SPRITE.pixels.map((row) => [...row]);
		result = applyHairStyle(result, hairStyle);
		if (hasGlasses) {
			result = applyGlasses(result);
		}
		return result;
	}, [hairStyle, hasGlasses]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.imageSmoothingEnabled = false;
		renderAvatar(ctx, pixels, colorMap, scale);
	}, [pixels, colorMap, scale]);

	return (
		<div className={`relative ${className}`} style={{ width: pixelSize, height: pixelSize }}>
			<canvas
				ref={canvasRef}
				width={pixelSize}
				height={pixelSize}
				className="animate-float"
				style={{ imageRendering: 'pixelated' }}
			/>
		</div>
	);
}
