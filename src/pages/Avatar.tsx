import { useState, useCallback } from 'react';
import { PixelBox } from '../components/common/PixelBox';
import {
	LayeredAvatar,
	ColorButton,
	PartCard,
	CategoryTabs,
} from '../components/avatar';
import { useLayeredAvatarStore } from '../stores';
import {
	SKIN_TONES,
	HAIR_COLORS,
	EYE_COLORS,
	ALL_PARTS,
	type SkinTone,
	type HairColor,
	type EyeColor,
	type IAvatarColors,
} from '../data/avatar/parts';
import {
	DEFAULT_PRESETS,
	SKIN_TONE_NAMES,
	HAIR_COLOR_NAMES,
	EYE_COLOR_NAMES,
	OUTFIT_COLOR_NAMES,
	type IAvatarPreset,
} from '../data/avatar/presets';

// 커스터마이징 카테고리
const CUSTOMIZE_CATEGORIES = [
	{ id: 'face', label: '얼굴', icon: '😊' },
	{ id: 'hair', label: '헤어', icon: '💇' },
	{ id: 'expression', label: '표정', icon: '✨' },
	{ id: 'outfit', label: '의상', icon: '👕' },
	{ id: 'accessory', label: '악세서리', icon: '👓' },
	{ id: 'background', label: '배경', icon: '🎨' },
] as const;

type CustomizeCategory = (typeof CUSTOMIZE_CATEGORIES)[number]['id'];

// 의상 색상 옵션 - 모던 팔레트
const OUTFIT_COLORS = [
	'#1C1C27', // 미드나잇
	'#2D3748', // 슬레이트
	'#4A5568', // 쿨그레이
	'#5B7C99', // 스틸블루
	'#3182CE', // 로얄블루
	'#319795', // 틸
	'#38A169', // 에메랄드
	'#805AD5', // 바이올렛
	'#B83280', // 마젠타
	'#C53030', // 크림슨
	'#DD6B20', // 탠저린
	'#D69E2E', // 골든
	'#718096', // 뉴트럴
	'#F7FAFC', // 화이트
];

// 스마트 랜덤 타입
type RandomMode = 'full' | 'harmonious' | 'keepSkin' | 'keepOutfit';

export function Avatar() {
	const [activeCategory, setActiveCategory] =
		useState<CustomizeCategory>('face');
	const [showPresets, setShowPresets] = useState(false);
	const [randomMode, setRandomMode] = useState<RandomMode>('full');

	// 스토어에서 아바타 설정 가져오기 (로컬스토리지에 자동 저장됨)
	const {
		config: avatarConfig,
		canUndo,
		canRedo,
		setSkinTone,
		setHairColor,
		setEyeColor,
		setOutfitColor,
		setPart,
		setConfig,
		undo,
		redo,
		applyPreset,
	} = useLayeredAvatarStore();

	// 색상 정보
	const colors: IAvatarColors = {
		skin: SKIN_TONES[avatarConfig.skinTone],
		hair: HAIR_COLORS[avatarConfig.hairColor],
		eyes: EYE_COLORS[avatarConfig.eyeColor],
		outfit: avatarConfig.outfitColor,
	};

	// 파츠 변경 핸들러
	const handlePartChange = (layer: string, partId: string | null) => {
		setPart(layer, partId);
	};

	// 피부톤 변경
	const handleSkinChange = (tone: SkinTone) => {
		setSkinTone(tone);
	};

	// 헤어 색상 변경
	const handleHairColorChange = (color: HairColor) => {
		setHairColor(color);
	};

	// 눈 색상 변경
	const handleEyeColorChange = (color: EyeColor) => {
		setEyeColor(color);
	};

	// 의상 색상 변경
	const handleOutfitColorChange = (color: string) => {
		setOutfitColor(color);
	};

	// 랜덤 아바타 생성 (스마트 랜덤)
	const randomizeAvatar = useCallback(() => {
		const randomPick = <T,>(arr: readonly T[]): T =>
			arr[Math.floor(Math.random() * arr.length)];

		// 조화로운 색상 조합 (피부톤과 헤어 색상 매칭)
		const harmonicHairColors: Record<SkinTone, HairColor[]> = {
			fair: ['black', 'darkBrown', 'brown', 'blonde', 'platinum', 'pink'],
			light: ['black', 'darkBrown', 'brown', 'auburn', 'blonde', 'blue'],
			medium: ['black', 'darkBrown', 'brown', 'auburn', 'purple'],
			tan: ['black', 'darkBrown', 'brown', 'auburn'],
			brown: ['black', 'darkBrown', 'brown'],
			dark: ['black', 'darkBrown', 'gray'],
		};

		let newSkinTone =
			randomMode === 'keepSkin'
				? avatarConfig.skinTone
				: randomPick(Object.keys(SKIN_TONES) as SkinTone[]);

		let newHairColor: HairColor;
		if (randomMode === 'harmonious') {
			newHairColor = randomPick(harmonicHairColors[newSkinTone]);
		} else {
			newHairColor = randomPick(Object.keys(HAIR_COLORS) as HairColor[]);
		}

		const newOutfitColor =
			randomMode === 'keepOutfit'
				? avatarConfig.outfitColor
				: randomPick(OUTFIT_COLORS);

		setConfig({
			skinTone: newSkinTone,
			hairColor: newHairColor,
			eyeColor: randomPick(Object.keys(EYE_COLORS) as EyeColor[]),
			outfitColor: newOutfitColor,
			parts: {
				head: 'head_default',
				ears: 'ears_default',
				face_shadow: 'face_shadow_default',
				body: 'body_default',
				eyes: randomPick(ALL_PARTS.eyes).id,
				eyebrows: randomPick(ALL_PARTS.eyebrows).id,
				nose: randomPick(ALL_PARTS.nose).id,
				mouth: randomPick(ALL_PARTS.mouth).id,
				blush: randomPick(ALL_PARTS.blush).id,
				hair_front: randomPick(ALL_PARTS.hair_front).id,
				hair_back: randomPick(ALL_PARTS.hair_back).id,
				outfit_back: 'outfit_back_none',
				outfit_front: randomPick(ALL_PARTS.outfit_front).id,
				accessory: randomPick(ALL_PARTS.accessory).id,
				background: randomPick(ALL_PARTS.background).id,
				effect: randomPick(ALL_PARTS.effect).id,
			},
		});
	}, [avatarConfig.skinTone, avatarConfig.outfitColor, randomMode, setConfig]);

	// 프리셋 적용
	const handlePresetApply = (preset: IAvatarPreset) => {
		applyPreset(preset.config);
		setShowPresets(false);
	};

	// 섹션 헤더 컴포넌트
	const SectionHeader = ({ title }: { title: string }) => (
		<div className="section-header">
			<div className="section-header-dot" />
			<h3 className="section-header-title">{title}</h3>
		</div>
	);

	// 카테고리별 렌더링
	const renderCategoryContent = () => {
		switch (activeCategory) {
			case 'face':
				return (
					<div className="space-y-6">
						{/* 피부톤 */}
						<div>
							<SectionHeader title="피부톤" />
							<div className="flex flex-wrap gap-3">
								{Object.entries(SKIN_TONES).map(([key, color]) => (
									<ColorButton
										key={key}
										color={color}
										colorName={SKIN_TONE_NAMES[key]}
										selected={avatarConfig.skinTone === key}
										onClick={() => handleSkinChange(key as SkinTone)}
										size={48}
									/>
								))}
							</div>
						</div>

						{/* 눈 색상 */}
						<div>
							<SectionHeader title="눈동자 색상" />
							<div className="flex flex-wrap gap-3">
								{Object.entries(EYE_COLORS).map(([key, color]) => (
									<ColorButton
										key={key}
										color={color}
										colorName={EYE_COLOR_NAMES[key]}
										selected={avatarConfig.eyeColor === key}
										onClick={() => handleEyeColorChange(key as EyeColor)}
										size={48}
									/>
								))}
							</div>
						</div>

						{/* 눈 스타일 */}
						<div>
							<SectionHeader title="눈 모양" />
							<div className="parts-grid">
								{ALL_PARTS.eyes.map((part) => (
									<PartCard
										key={part.id}
										layer="eyes"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.eyes === part.id}
										onClick={() => handlePartChange('eyes', part.id)}
									/>
								))}
							</div>
						</div>

						{/* 눈썹 */}
						<div>
							<SectionHeader title="눈썹" />
							<div className="parts-grid">
								{ALL_PARTS.eyebrows.map((part) => (
									<PartCard
										key={part.id}
										layer="eyebrows"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.eyebrows === part.id}
										onClick={() => handlePartChange('eyebrows', part.id)}
									/>
								))}
							</div>
						</div>

						{/* 코 */}
						<div>
							<SectionHeader title="코" />
							<div className="parts-grid">
								{ALL_PARTS.nose.map((part) => (
									<PartCard
										key={part.id}
										layer="nose"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.nose === part.id}
										onClick={() => handlePartChange('nose', part.id)}
									/>
								))}
							</div>
						</div>
					</div>
				);

			case 'hair':
				return (
					<div className="space-y-6">
						{/* 헤어 색상 */}
						<div>
							<SectionHeader title="헤어 색상" />
							<div className="flex flex-wrap gap-3">
								{Object.entries(HAIR_COLORS).map(([key, color]) => (
									<ColorButton
										key={key}
										color={color}
										colorName={HAIR_COLOR_NAMES[key]}
										selected={avatarConfig.hairColor === key}
										onClick={() => handleHairColorChange(key as HairColor)}
										size={48}
									/>
								))}
							</div>
						</div>

						{/* 앞머리 스타일 */}
						<div>
							<SectionHeader title="앞머리" />
							<div className="parts-grid">
								{ALL_PARTS.hair_front.map((part) => (
									<PartCard
										key={part.id}
										layer="hair_front"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.hair_front === part.id}
										onClick={() => handlePartChange('hair_front', part.id)}
									/>
								))}
							</div>
						</div>

						{/* 뒷머리 스타일 */}
						<div>
							<SectionHeader title="뒷머리" />
							<div className="parts-grid">
								{ALL_PARTS.hair_back.map((part) => (
									<PartCard
										key={part.id}
										layer="hair_back"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.hair_back === part.id}
										onClick={() => handlePartChange('hair_back', part.id)}
									/>
								))}
							</div>
						</div>
					</div>
				);

			case 'expression':
				return (
					<div className="space-y-6">
						{/* 입 */}
						<div>
							<SectionHeader title="입" />
							<div className="parts-grid">
								{ALL_PARTS.mouth.map((part) => (
									<PartCard
										key={part.id}
										layer="mouth"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.mouth === part.id}
										onClick={() => handlePartChange('mouth', part.id)}
									/>
								))}
							</div>
						</div>

						{/* 볼터치 */}
						<div>
							<SectionHeader title="볼터치" />
							<div className="parts-grid">
								{ALL_PARTS.blush.map((part) => (
									<PartCard
										key={part.id}
										layer="blush"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.blush === part.id}
										onClick={() => handlePartChange('blush', part.id)}
									/>
								))}
							</div>
						</div>

						{/* 이펙트 */}
						<div>
							<SectionHeader title="이펙트" />
							<div className="parts-grid">
								{ALL_PARTS.effect.map((part) => (
									<PartCard
										key={part.id}
										layer="effect"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.effect === part.id}
										onClick={() => handlePartChange('effect', part.id)}
									/>
								))}
							</div>
						</div>
					</div>
				);

			case 'outfit':
				return (
					<div className="space-y-6">
						{/* 의상 색상 */}
						<div>
							<SectionHeader title="의상 색상" />
							<div className="flex flex-wrap gap-3">
								{OUTFIT_COLORS.map((color) => (
									<ColorButton
										key={color}
										color={color}
										colorName={OUTFIT_COLOR_NAMES[color]}
										selected={avatarConfig.outfitColor === color}
										onClick={() => handleOutfitColorChange(color)}
										size={48}
									/>
								))}
							</div>
						</div>

						{/* 의상 스타일 */}
						<div>
							<SectionHeader title="의상 스타일" />
							<div className="parts-grid">
								{ALL_PARTS.outfit_front.map((part) => (
									<PartCard
										key={part.id}
										layer="outfit_front"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.outfit_front === part.id}
										onClick={() => handlePartChange('outfit_front', part.id)}
									/>
								))}
							</div>
						</div>
					</div>
				);

			case 'accessory':
				return (
					<div className="space-y-6">
						<div>
							<SectionHeader title="악세서리" />
							<div className="parts-grid">
								{ALL_PARTS.accessory.map((part) => (
									<PartCard
										key={part.id}
										layer="accessory"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.accessory === part.id}
										onClick={() => handlePartChange('accessory', part.id)}
									/>
								))}
							</div>
						</div>
					</div>
				);

			case 'background':
				return (
					<div className="space-y-6">
						<div>
							<SectionHeader title="배경" />
							<div className="parts-grid">
								{ALL_PARTS.background.map((part) => (
									<PartCard
										key={part.id}
										layer="background"
										partId={part.id}
										partName={part.name}
										colors={colors}
										selected={avatarConfig.parts.background === part.id}
										onClick={() => handlePartChange('background', part.id)}
									/>
								))}
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="max-w-5xl mx-auto pb-20 md:pb-0">
			<div className="mb-6">
				<h1 className="page-title gradient-text mb-2">
					아바타 커스터마이징
				</h1>
				<p className="text-[#8888aa] text-sm">
					나만의 개성있는 캐릭터를 만들어보세요
				</p>
			</div>

			<div className="grid grid-cols-12 gap-6">
				{/* 아바타 프리뷰 */}
				<div className="col-span-12 md:col-span-4">
					<PixelBox variant="gradient" className="p-6 sticky top-6">
						{/* 메인 아바타 */}
						<div className="avatar-preview-container aspect-square flex items-center justify-center mb-5 border border-[rgba(90,90,154,0.2)]">
							<div className="avatar-inner">
								<LayeredAvatar config={avatarConfig} size={220} animated />
							</div>
						</div>

						{/* 히스토리 버튼 */}
						<div className="flex items-center justify-center gap-2 mb-4">
							<button
								onClick={undo}
								disabled={!canUndo}
								className="history-btn"
								title="실행 취소 (Undo)"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M3 7v6h6" />
									<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
								</svg>
							</button>
							<button
								onClick={redo}
								disabled={!canRedo}
								className="history-btn"
								title="다시 실행 (Redo)"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M21 7v6h-6" />
									<path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
								</svg>
							</button>
						</div>

						{/* 액션 버튼 */}
						<div className="space-y-3">
							{/* 랜덤 생성 버튼 */}
							<button onClick={randomizeAvatar} className="action-btn w-full">
								<span className="dice-icon">🎲</span>
								<span>랜덤 생성</span>
							</button>

							{/* 스마트 랜덤 옵션 */}
							<div className="flex flex-wrap gap-1 text-xs">
								<button
									onClick={() => setRandomMode('full')}
									className={`random-option flex-1 ${randomMode === 'full' ? 'random-option-selected' : ''}`}
								>
									전체
								</button>
								<button
									onClick={() => setRandomMode('harmonious')}
									className={`random-option flex-1 ${randomMode === 'harmonious' ? 'random-option-selected' : ''}`}
								>
									조화
								</button>
								<button
									onClick={() => setRandomMode('keepSkin')}
									className={`random-option flex-1 ${randomMode === 'keepSkin' ? 'random-option-selected' : ''}`}
								>
									피부 유지
								</button>
								<button
									onClick={() => setRandomMode('keepOutfit')}
									className={`random-option flex-1 ${randomMode === 'keepOutfit' ? 'random-option-selected' : ''}`}
								>
									의상 유지
								</button>
							</div>

							{/* 프리셋 버튼 */}
							<button
								onClick={() => setShowPresets(!showPresets)}
								className="action-btn w-full"
							>
								<span>📋</span>
								<span>프리셋</span>
							</button>
						</div>

						{/* 프리셋 목록 */}
						{showPresets && (
							<div className="mt-4 space-y-2">
								<p className="text-xs text-[#8888aa] mb-2">기본 프리셋</p>
								{DEFAULT_PRESETS.map((preset) => (
									<button
										key={preset.id}
										onClick={() => handlePresetApply(preset)}
										className="preset-card w-full text-left"
									>
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[rgba(0,212,255,0.1)] to-[rgba(168,85,247,0.1)] flex-shrink-0">
												<LayeredAvatar config={preset.config} size={40} />
											</div>
											<div>
												<p className="text-sm font-medium">{preset.name}</p>
												<p className="text-xs text-[#8888aa]">
													{preset.description}
												</p>
											</div>
										</div>
									</button>
								))}
							</div>
						)}
					</PixelBox>
				</div>

				{/* 커스터마이징 패널 */}
				<div className="col-span-12 md:col-span-8">
					{/* 카테고리 탭 */}
					<div className="mb-5">
						<CategoryTabs
							categories={CUSTOMIZE_CATEGORIES}
							activeCategory={activeCategory}
							onCategoryChange={(id) =>
								setActiveCategory(id as CustomizeCategory)
							}
						/>
					</div>

					{/* 카테고리 컨텐츠 */}
					<PixelBox className="p-5 min-h-[500px]">
						{renderCategoryContent()}
					</PixelBox>
				</div>
			</div>

			{/* 모바일 하단 액션바 */}
			<div className="mobile-action-bar md:hidden">
				<button
					onClick={undo}
					disabled={!canUndo}
					className="history-btn"
					title="실행 취소"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M3 7v6h6" />
						<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
					</svg>
				</button>
				<button
					onClick={redo}
					disabled={!canRedo}
					className="history-btn"
					title="다시 실행"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 7v6h-6" />
						<path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
					</svg>
				</button>
				<button onClick={randomizeAvatar} className="action-btn">
					<span className="dice-icon">🎲</span>
				</button>
				<button
					onClick={() => setShowPresets(!showPresets)}
					className="action-btn"
				>
					<span>📋</span>
				</button>
			</div>
		</div>
	);
}
