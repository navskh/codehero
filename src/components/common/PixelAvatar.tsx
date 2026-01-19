import { useMemo } from 'react';
import { useAvatarStore } from '../../stores';

interface IPixelAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

// 메이플 스타일 색상 팔레트
const COLORS = {
  skin: ['#ffe8d6', '#ffd4b8', '#f5c9a0', '#e5b78e', '#c49360', '#a67c52'],
  hair: ['#1a1a2e', '#2d2d44', '#4a3728', '#6b4423', '#8b5a2b', '#daa520'],
  outfit: {
    outfit_casual: '#5b9bd5',
    outfit_hoodie: '#4a5568',
    outfit_suit: '#2d3748',
  },
  // 눈 색상
  eyeWhite: '#ffffff',
  eyeColor: '#2d1b4e',      // 진한 보라/검정
  eyeHighlight: '#ffffff',   // 하이라이트
  eyeHighlight2: '#a8d8ff',  // 두번째 하이라이트 (하늘색)
  // 기타
  blush: '#ffb4b4',          // 볼터치
  mouth: '#d4a574',          // 입
  glasses: '#87ceeb',
  glassesFrame: '#4a5568',
  laptop: '#374151',
  laptopScreen: '#67e8f9',
};

// 메이플 스타일 아바타 (28x28 픽셀, 큰머리 귀여운 스타일)
const createMapleAvatar = (skinTone: number, hairStyle: string, outfit: string, hasGlasses: boolean) => {
  const skin = COLORS.skin[skinTone] || COLORS.skin[0];
  const hair = COLORS.hair[skinTone] || COLORS.hair[0];
  const outfitColor = COLORS.outfit[outfit as keyof typeof COLORS.outfit] || COLORS.outfit.outfit_hoodie;

  // 픽셀 코드:
  // 0: 투명, 1: 머리카락, 2: 피부, 3: 눈흰자, 4: 눈동자, 5: 눈하이라이트
  // 6: 의상, 7: 안경테, 8: 안경렌즈, 9: 노트북, A: 노트북화면
  // B: 볼터치, C: 두번째하이라이트, D: 입

  const pixels: string[][] = [
    // Row 0-4: 머리카락 상단 (더 좁게)
    ['0','0','0','0','0','0','0','0','0','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0'],
    // Row 5-7: 이마 (갸름하게)
    ['0','0','0','0','0','0','1','1','1','2','2','2','2','2','2','2','2','2','2','1','1','1','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','1','1','2','2','2','2','2','2','2','2','2','2','2','2','1','1','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','1','2','2','2','2','2','2','2','2','2','2','2','2','2','2','1','0','0','0','0','0','0'],
    // Row 8-12: 눈 영역 (갸름한 얼굴)
    ['0','0','0','0','0','0','2','2','3','3','3','2','2','2','2','2','2','3','3','3','2','2','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','2','3','3','4','4','3','2','2','2','2','3','3','4','4','3','2','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','2','3','5','4','4','3','2','2','2','2','3','5','4','4','3','2','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','2','3','C','4','4','3','2','2','2','2','3','C','4','4','3','2','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','2','2','3','3','3','2','2','2','2','2','2','3','3','3','2','2','0','0','0','0','0','0'],
    // Row 13: 볼터치 (좁게)
    ['0','0','0','0','0','0','0','B','2','2','2','2','2','2','2','2','2','2','2','2','B','0','0','0','0','0','0','0'],
    // Row 14: 입 (좁게)
    ['0','0','0','0','0','0','0','2','2','2','2','2','D','D','D','D','2','2','2','2','2','0','0','0','0','0','0','0'],
    // Row 15-17: 턱 (갸름하게 - V라인)
    ['0','0','0','0','0','0','0','0','2','2','2','2','2','2','2','2','2','2','2','2','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','2','2','2','2','2','2','2','2','2','2','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0','2','2','2','2','2','2','2','2','0','0','0','0','0','0','0','0','0','0'],
    // Row 18-21: 목/어깨/몸통
    ['0','0','0','0','0','0','0','0','0','0','0','6','6','6','6','6','6','0','0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0','6','6','6','6','6','6','6','6','0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','6','6','6','6','6','6','6','6','6','6','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','6','6','6','6','6','6','6','6','6','6','6','6','0','0','0','0','0','0','0','0'],
    // Row 22-24: 노트북 들고 있는 모습
    ['0','0','0','0','0','0','0','2','6','6','9','9','9','9','9','9','9','9','6','6','2','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','2','9','A','A','A','A','A','A','A','A','9','2','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','9','9','9','9','9','9','9','9','9','9','0','0','0','0','0','0','0','0','0'],
    // Row 25-27: 빈 공간
    ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
    ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
  ];

  // 헤어스타일 변형
  if (hairStyle === 'hair_messy') {
    // 헝클어진 머리 - 삐죽삐죽
    pixels[0] = ['0','0','0','0','0','0','0','0','1','1','0','1','1','0','1','1','0','1','1','0','0','0','0','0','0','0','0','0'];
    pixels[1] = ['0','0','0','0','0','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0','0'];
  } else if (hairStyle === 'hair_long') {
    // 긴 머리 - 양옆으로 내려옴
    for (let i = 5; i <= 17; i++) {
      if (pixels[i]) {
        pixels[i][5] = '1';
        pixels[i][22] = '1';
      }
    }
  }

  // 안경 적용
  if (hasGlasses) {
    // 안경테 (눈 주변 - 더 좁은 얼굴에 맞춤)
    // 왼쪽 눈
    pixels[8][7] = '7'; pixels[8][11] = '7';
    pixels[9][7] = '7'; pixels[9][11] = '7';
    pixels[10][7] = '7'; pixels[10][11] = '7';
    pixels[11][7] = '7'; pixels[11][11] = '7';
    pixels[12][7] = '7'; pixels[12][8] = '7'; pixels[12][9] = '7'; pixels[12][10] = '7'; pixels[12][11] = '7';
    // 오른쪽 눈
    pixels[8][16] = '7'; pixels[8][20] = '7';
    pixels[9][16] = '7'; pixels[9][20] = '7';
    pixels[10][16] = '7'; pixels[10][20] = '7';
    pixels[11][16] = '7'; pixels[11][20] = '7';
    pixels[12][16] = '7'; pixels[12][17] = '7'; pixels[12][18] = '7'; pixels[12][19] = '7'; pixels[12][20] = '7';
    // 코 브릿지
    pixels[10][12] = '7'; pixels[10][13] = '7'; pixels[10][14] = '7'; pixels[10][15] = '7';
  }

  const colorMap: Record<string, string> = {
    '0': 'transparent',
    '1': hair,
    '2': skin,
    '3': COLORS.eyeWhite,
    '4': COLORS.eyeColor,
    '5': COLORS.eyeHighlight,
    '6': outfitColor,
    '7': COLORS.glassesFrame,
    '8': COLORS.glasses,
    '9': COLORS.laptop,
    'A': COLORS.laptopScreen,
    'B': COLORS.blush,
    'C': COLORS.eyeHighlight2,
    'D': COLORS.mouth,
  };

  return { pixels, colorMap };
};

export function PixelAvatar({ size = 'md', animated = true, className = '' }: IPixelAvatarProps) {
  const { avatar } = useAvatarStore();

  const sizeMap = {
    sm: 56,
    md: 84,
    lg: 112,
    xl: 168,
  };

  const pixelSize = sizeMap[size];
  const scale = pixelSize / 56; // 28x28 픽셀 * 2px = 56px 기준

  const { pixels, colorMap } = useMemo(() => {
    // 안경은 악세서리가 없거나 acc_glasses일 때 착용
    const hasGlasses = !avatar.equipment.accessory || avatar.equipment.accessory === 'acc_glasses';
    return createMapleAvatar(
      avatar.base.skinTone,
      avatar.equipment.hair || 'hair_short_black',
      avatar.equipment.outfit || 'outfit_hoodie',
      hasGlasses
    );
  }, [avatar.base.skinTone, avatar.equipment.hair, avatar.equipment.outfit, avatar.equipment.accessory]);

  // CSS box-shadow로 픽셀 생성
  const boxShadow = useMemo(() => {
    const shadows: string[] = [];
    const pixelUnit = 2 * scale;

    pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel !== '0') {
          const color = colorMap[pixel];
          shadows.push(`${x * pixelUnit}px ${y * pixelUnit}px 0 ${color}`);
        }
      });
    });

    return shadows.join(', ');
  }, [pixels, colorMap, scale]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      {/* 픽셀 아바타 */}
      <div
        className={`absolute ${animated ? 'animate-float' : ''}`}
        style={{
          width: 2 * scale,
          height: 2 * scale,
          boxShadow,
          imageRendering: 'pixelated',
        }}
      />

      {/* 이펙트 오버레이 */}
      {avatar.equipment.effect === 'effect_sparkle' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-3 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
          <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-6 right-2 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
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
            background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
            filter: 'blur(12px)',
          }}
        />
      )}
    </div>
  );
}

// 간단한 정적 픽셀 아바타
export function StaticPixelAvatar({
  skinTone = 0,
  size = 'md',
  className = ''
}: {
  skinTone?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeMap = {
    sm: 56,
    md: 84,
    lg: 112,
    xl: 168,
  };

  const pixelSize = sizeMap[size];
  const scale = pixelSize / 56;

  const { pixels, colorMap } = createMapleAvatar(skinTone, 'hair_short_black', 'outfit_hoodie', true);

  const boxShadow = useMemo(() => {
    const shadows: string[] = [];
    const pixelUnit = 2 * scale;

    pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel !== '0') {
          const color = colorMap[pixel];
          shadows.push(`${x * pixelUnit}px ${y * pixelUnit}px 0 ${color}`);
        }
      });
    });

    return shadows.join(', ');
  }, [pixels, colorMap, scale]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      <div
        className="absolute animate-float"
        style={{
          width: 2 * scale,
          height: 2 * scale,
          boxShadow,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
