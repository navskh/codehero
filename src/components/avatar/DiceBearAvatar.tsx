/**
 * DiceBear Avatar Component
 *
 * 다양한 스타일의 고퀄리티 아바타
 * - adventurer: 손그림 스타일 캐릭터
 * - avataaars: 컬러풀한 캐릭터 (Notion 스타일)
 * - lorelei: 상세한 캐릭터
 * - pixelArt: 레트로 8비트
 * - bigEars: 귀여운 큰귀 캐릭터
 * - bigSmile: 밝은 웃음 캐릭터
 * - bottts: 로봇 스타일
 */

import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import {
	adventurer,
	avataaars,
	lorelei,
	pixelArt,
	bigEars,
	bigSmile,
	bottts,
	notionists,
} from '@dicebear/collection';
import { useAvatarStore } from '../../stores';

export type AvatarStyle =
	| 'adventurer'
	| 'avataaars'
	| 'lorelei'
	| 'pixelArt'
	| 'bigEars'
	| 'bigSmile'
	| 'bottts'
	| 'notionists';

const styleMap = {
	adventurer,
	avataaars,
	lorelei,
	pixelArt,
	bigEars,
	bigSmile,
	bottts,
	notionists,
};

interface IDiceBearAvatarProps {
	/** 아바타 스타일 */
	style?: AvatarStyle;
	/** 시드 (같은 시드 = 같은 아바타) */
	seed?: string;
	/** 크기 (px) */
	size?: number;
	/** 배경색 */
	backgroundColor?: string;
	/** 추가 클래스 */
	className?: string;
	/** 애니메이션 */
	animated?: boolean;
}

/**
 * DiceBear 기반 고퀄리티 아바타
 */
export function DiceBearAvatar({
	style = 'adventurer',
	seed,
	size = 128,
	backgroundColor,
	className = '',
	animated = true,
}: IDiceBearAvatarProps) {
	const { avatar } = useAvatarStore();

	// 시드 생성 (아바타 상태 기반)
	const avatarSeed = useMemo(() => {
		if (seed) return seed;
		// 장착 아이템 기반으로 고유 시드 생성
		return `codehero-${avatar.base.skinTone}-${avatar.equipment.hair}-${avatar.equipment.outfit}`;
	}, [seed, avatar.base.skinTone, avatar.equipment.hair, avatar.equipment.outfit]);

	// SVG 생성
	const svgString = useMemo(() => {
		const styleModule = styleMap[style];
		if (!styleModule) return '';

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const avatarInstance = createAvatar(styleModule as any, {
			seed: avatarSeed,
			size: size,
			backgroundColor: backgroundColor ? [backgroundColor.replace('#', '')] : undefined,
		});

		return avatarInstance.toString();
	}, [style, avatarSeed, size, backgroundColor]);

	return (
		<div
			className={`relative ${animated ? 'animate-float' : ''} ${className}`}
			style={{ width: size, height: size }}
			dangerouslySetInnerHTML={{ __html: svgString }}
		/>
	);
}

/**
 * 정적 DiceBear 아바타 (스토어 의존 없음)
 */
export function StaticDiceBearAvatar({
	style = 'adventurer',
	seed = 'codehero',
	size = 128,
	backgroundColor,
	className = '',
	animated = true,
}: Omit<IDiceBearAvatarProps, 'seed'> & { seed?: string }) {
	const svgString = useMemo(() => {
		const styleModule = styleMap[style];
		if (!styleModule) return '';

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const avatarInstance = createAvatar(styleModule as any, {
			seed,
			size,
			backgroundColor: backgroundColor ? [backgroundColor.replace('#', '')] : undefined,
		});

		return avatarInstance.toString();
	}, [style, seed, size, backgroundColor]);

	return (
		<div
			className={`relative ${animated ? 'animate-float' : ''} ${className}`}
			style={{ width: size, height: size }}
			dangerouslySetInnerHTML={{ __html: svgString }}
		/>
	);
}

/**
 * 아바타 스타일 프리뷰 (모든 스타일 미리보기)
 */
export function AvatarStylePreview({
	seed = 'codehero',
	size = 64,
	onSelect,
	selectedStyle,
}: {
	seed?: string;
	size?: number;
	onSelect?: (style: AvatarStyle) => void;
	selectedStyle?: AvatarStyle;
}) {
	const styles: AvatarStyle[] = [
		'adventurer',
		'avataaars',
		'lorelei',
		'pixelArt',
		'bigEars',
		'bigSmile',
		'bottts',
		'notionists',
	];

	const styleLabels: Record<AvatarStyle, string> = {
		adventurer: '모험가',
		avataaars: '아바타',
		lorelei: '로렐라이',
		pixelArt: '픽셀아트',
		bigEars: '큰귀',
		bigSmile: '웃음',
		bottts: '로봇',
		notionists: '노션',
	};

	return (
		<div className="grid grid-cols-4 gap-3">
			{styles.map((style) => (
				<button
					key={style}
					onClick={() => onSelect?.(style)}
					className={`p-2 rounded-xl transition-all ${
						selectedStyle === style
							? 'ring-2 ring-[#00d4ff] bg-[rgba(0,212,255,0.1)]'
							: 'hover:bg-[rgba(255,255,255,0.05)]'
					}`}
				>
					<StaticDiceBearAvatar
						style={style}
						seed={seed}
						size={size}
						animated={false}
					/>
					<p className="text-xs text-center mt-1 text-[#8888aa]">
						{styleLabels[style]}
					</p>
				</button>
			))}
		</div>
	);
}
