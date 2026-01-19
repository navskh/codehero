/**
 * CategoryTabs Component
 * 개선된 카테고리 탭 - 슬라이딩 인디케이터, 아이콘 강조
 */

import { useRef, useState, useEffect } from 'react';

interface ICategory {
	id: string;
	label: string;
	icon: string;
}

interface ICategoryTabsProps {
	categories: readonly ICategory[];
	activeCategory: string;
	onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({
	categories,
	activeCategory,
	onCategoryChange,
}: ICategoryTabsProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

	// 인디케이터 위치 업데이트
	useEffect(() => {
		if (!containerRef.current) return;

		const activeIndex = categories.findIndex(
			(cat) => cat.id === activeCategory
		);
		if (activeIndex === -1) return;

		const buttons = containerRef.current.querySelectorAll('button');
		const activeButton = buttons[activeIndex];

		if (activeButton) {
			setIndicatorStyle({
				left: activeButton.offsetLeft,
				width: activeButton.offsetWidth,
			});
		}
	}, [activeCategory, categories]);

	return (
		<div
			ref={containerRef}
			className="category-tabs-container overflow-x-auto pb-2 scrollbar-hide"
		>
			{/* 슬라이딩 인디케이터 */}
			<div
				className="category-tab-indicator"
				style={{
					left: indicatorStyle.left,
					width: indicatorStyle.width,
				}}
			/>

			{categories.map((cat) => (
				<button
					key={cat.id}
					onClick={() => onCategoryChange(cat.id)}
					className={`category-tab-v2 ${
						activeCategory === cat.id ? 'category-tab-v2-active' : ''
					}`}
				>
					<span className="category-tab-icon">{cat.icon}</span>
					<span className="category-tab-label">{cat.label}</span>
				</button>
			))}
		</div>
	);
}

export default CategoryTabs;
