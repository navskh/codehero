/**
 * Canvas-based Avatar Renderer
 *
 * box-shadow 기반 렌더링을 Canvas로 대체하여 성능 향상
 */

import {
	PIXEL_GRID_SIZE,
	SKIN_PALETTE,
	HAIR_PALETTE,
	EYE_COLORS,
	MISC_COLORS,
	OUTFIT_COLORS,
} from '../../data/avatar/constants';
import type { PixelCode } from '../../data/avatar/sprites/baseSprite';

export interface IRenderOptions {
	skinTone: number;
	hairColor: number;
	outfitId: string;
	hasGlasses: boolean;
}

export interface IColorMap {
	[key: string]: string;
}

/**
 * 픽셀 코드에서 색상 맵 생성
 */
export function createColorMap(options: IRenderOptions): IColorMap {
	const skin = SKIN_PALETTE[options.skinTone] || SKIN_PALETTE[0];
	const hair = HAIR_PALETTE[options.hairColor] || HAIR_PALETTE[0];
	const outfit = OUTFIT_COLORS[options.outfitId] || OUTFIT_COLORS.outfit_hoodie;

	return {
		'0': 'transparent',
		'1': hair,
		'2': skin,
		'3': EYE_COLORS.white,
		'4': EYE_COLORS.pupil,
		'5': EYE_COLORS.highlight,
		'6': outfit,
		'7': MISC_COLORS.glassesFrame,
		'8': MISC_COLORS.glasses,
		'9': MISC_COLORS.laptop,
		A: MISC_COLORS.laptopScreen,
		B: MISC_COLORS.blush,
		C: EYE_COLORS.highlight2,
		D: MISC_COLORS.mouth,
	};
}

/**
 * Canvas에 픽셀 아바타 렌더링
 */
export function renderToCanvas(
	ctx: CanvasRenderingContext2D,
	pixels: PixelCode[][],
	colorMap: IColorMap,
	scale: number = 2
): void {
	const pixelSize = scale;

	// 캔버스 클리어
	ctx.clearRect(0, 0, PIXEL_GRID_SIZE * scale, PIXEL_GRID_SIZE * scale);

	// 픽셀 렌더링 최적화: 같은 색상 픽셀 묶어서 처리
	const colorGroups = new Map<string, Array<{ x: number; y: number }>>();

	pixels.forEach((row, y) => {
		row.forEach((pixel, x) => {
			if (pixel !== '0') {
				const color = colorMap[pixel];
				if (!colorGroups.has(color)) {
					colorGroups.set(color, []);
				}
				colorGroups.get(color)!.push({ x, y });
			}
		});
	});

	// 색상별로 배치 렌더링
	colorGroups.forEach((positions, color) => {
		ctx.fillStyle = color;
		positions.forEach(({ x, y }) => {
			ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
		});
	});
}

/**
 * Canvas를 Blob으로 변환 (이미지 내보내기용)
 */
export async function canvasToBlob(
	canvas: HTMLCanvasElement,
	type: string = 'image/png',
	quality: number = 1
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error('Failed to create blob'));
				}
			},
			type,
			quality
		);
	});
}

/**
 * Canvas를 Data URL로 변환
 */
export function canvasToDataURL(
	canvas: HTMLCanvasElement,
	type: string = 'image/png',
	quality: number = 1
): string {
	return canvas.toDataURL(type, quality);
}

/**
 * 오프스크린 Canvas 생성
 */
export function createOffscreenCanvas(
	width: number,
	height: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d')!;

	// 픽셀 아트 스타일 설정
	ctx.imageSmoothingEnabled = false;

	return { canvas, ctx };
}

/**
 * 스프라이트 캐시 (성능 최적화)
 */
class SpriteCache {
	private cache = new Map<string, ImageBitmap>();
	private maxSize: number;

	constructor(maxSize: number = 50) {
		this.maxSize = maxSize;
	}

	private createKey(spriteId: string, options: IRenderOptions): string {
		return `${spriteId}:${options.skinTone}:${options.hairColor}:${options.outfitId}:${options.hasGlasses}`;
	}

	async get(
		spriteId: string,
		pixels: PixelCode[][],
		options: IRenderOptions,
		scale: number
	): Promise<ImageBitmap> {
		const key = this.createKey(spriteId, options);

		if (this.cache.has(key)) {
			return this.cache.get(key)!;
		}

		// 새 스프라이트 생성
		const bitmap = await this.createSpriteBitmap(pixels, options, scale);

		// 캐시 관리 (LRU 방식)
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey) {
				this.cache.get(firstKey)?.close();
				this.cache.delete(firstKey);
			}
		}

		this.cache.set(key, bitmap);
		return bitmap;
	}

	private async createSpriteBitmap(
		pixels: PixelCode[][],
		options: IRenderOptions,
		scale: number
	): Promise<ImageBitmap> {
		const { canvas, ctx } = createOffscreenCanvas(
			PIXEL_GRID_SIZE * scale,
			PIXEL_GRID_SIZE * scale
		);

		const colorMap = createColorMap(options);
		renderToCanvas(ctx, pixels, colorMap, scale);

		return createImageBitmap(canvas);
	}

	clear(): void {
		this.cache.forEach((bitmap) => bitmap.close());
		this.cache.clear();
	}
}

// 싱글톤 캐시 인스턴스
export const spriteCache = new SpriteCache();
