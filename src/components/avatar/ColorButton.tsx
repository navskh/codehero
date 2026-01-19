/**
 * ColorButton Component
 * 개선된 색상 선택 버튼 - 48px 크기, 호버 효과, 선택 시 체크 아이콘, 툴팁
 */

import { useState } from 'react';

interface IColorButtonProps {
	color: string;
	colorName?: string;
	selected?: boolean;
	onClick?: () => void;
	size?: number;
}

export function ColorButton({
	color,
	colorName,
	selected = false,
	onClick,
	size = 48,
}: IColorButtonProps) {
	const [showTooltip, setShowTooltip] = useState(false);

	// 밝은 색상인지 판별 (체크 아이콘 색상 결정용)
	const isLightColor = () => {
		const hex = color.replace('#', '');
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.6;
	};

	return (
		<div
			className="relative"
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			<button
				onClick={onClick}
				className={`color-btn ${selected ? 'color-btn-selected' : ''}`}
				style={{
					width: size,
					height: size,
					backgroundColor: color,
					color: isLightColor() ? '#1a1a2e' : '#ffffff',
				}}
				aria-label={colorName || color}
			>
				{selected && (
					<span
						className="absolute inset-0 flex items-center justify-center text-base font-bold"
						style={{
							textShadow: isLightColor()
								? 'none'
								: '0 1px 2px rgba(0, 0, 0, 0.5)',
						}}
					>
						✓
					</span>
				)}
			</button>

			{/* 툴팁 */}
			{showTooltip && colorName && (
				<div
					className="color-tooltip"
					style={{
						bottom: size + 8,
						left: '50%',
					}}
				>
					{colorName}
				</div>
			)}
		</div>
	);
}

export default ColorButton;
