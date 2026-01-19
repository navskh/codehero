/**
 * PartCard Component
 * 개선된 파츠 선택 카드 - 80px 크기, 호버/선택 효과, 체크 배지
 */

import { useMemo } from 'react';
import {
	ALL_PARTS,
	type IAvatarColors,
	type ZmapLayer,
} from '../../data/avatar/parts';

interface IPartCardProps {
	layer: ZmapLayer;
	partId: string;
	partName: string;
	colors: IAvatarColors;
	selected?: boolean;
	onClick?: () => void;
	size?: number;
}

export function PartCard({
	layer,
	partId,
	partName,
	colors,
	selected = false,
	onClick,
	size = 80,
}: IPartCardProps) {
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
			<div className="text-center">
				<button
					onClick={onClick}
					className={`part-card aspect-square flex items-center justify-center ${
						selected ? 'part-card-selected' : ''
					}`}
					style={{ width: size, height: size }}
				>
					<span className="text-2xl opacity-40">✕</span>
				</button>
				<p className="text-xs text-[#8888aa] mt-1.5 font-medium">{partName}</p>
			</div>
		);
	}

	const fullSvg = `
		<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
			<g>${svgContent}</g>
		</svg>
	`;

	return (
		<div className="text-center">
			<button
				onClick={onClick}
				className={`part-card aspect-square p-2 ${
					selected ? 'part-card-selected' : ''
				}`}
				style={{ width: size, height: size }}
			>
				<div
					className="w-full h-full"
					dangerouslySetInnerHTML={{ __html: fullSvg }}
				/>
			</button>
			<p className="text-xs text-[#8888aa] mt-1.5 font-medium">{partName}</p>
		</div>
	);
}

export default PartCard;
