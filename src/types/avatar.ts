// 아바타 타입 정의

export interface IAvatar {
  id: string;
  base: IAvatarBase;
  equipment: IAvatarEquipment;
  unlockedItems: string[];
  currentAnimation: AvatarAnimation;
}

export interface IAvatarBase {
  skinTone: number; // 0-5
  eyeStyle: number; // 0-9
  eyeColor: number; // 0-7
}

export interface IAvatarEquipment {
  hair: string | null;
  outfit: string | null;
  accessory: string | null;
  background: string | null;
  effect: string | null;
}

export type AvatarAnimation = 'idle' | 'happy' | 'coding' | 'levelup' | 'achievement' | 'thinking';

export type ItemCategory = 'hair' | 'outfit' | 'accessory' | 'background' | 'effect';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface IAvatarItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  spriteSheet: string;
  spritePosition: { x: number; y: number; width: number; height: number };
  unlockCondition: IUnlockCondition;
  description: string;
}

export interface IUnlockCondition {
  type: 'level' | 'achievement' | 'skill' | 'default';
  value: number | string;
}

// 기본 아이템 정의
export const DEFAULT_AVATAR_ITEMS: IAvatarItem[] = [
  // 헤어스타일
  {
    id: 'hair_short_black',
    name: '짧은 검은 머리',
    category: 'hair',
    rarity: 'common',
    spriteSheet: '/sprites/avatars/hair/short_black.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'default', value: 0 },
    description: '깔끔한 짧은 머리',
  },
  {
    id: 'hair_messy',
    name: '헝클어진 머리',
    category: 'hair',
    rarity: 'common',
    spriteSheet: '/sprites/avatars/hair/messy.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'default', value: 0 },
    description: '야근의 흔적',
  },
  {
    id: 'hair_long',
    name: '긴 머리',
    category: 'hair',
    rarity: 'uncommon',
    spriteSheet: '/sprites/avatars/hair/long.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'level', value: 5 },
    description: '우아한 긴 머리',
  },
  // 의상
  {
    id: 'outfit_casual',
    name: '캐주얼 셔츠',
    category: 'outfit',
    rarity: 'common',
    spriteSheet: '/sprites/avatars/outfit/casual.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'default', value: 0 },
    description: '편안한 일상복',
  },
  {
    id: 'outfit_hoodie',
    name: '개발자 후드티',
    category: 'outfit',
    rarity: 'common',
    spriteSheet: '/sprites/avatars/outfit/hoodie.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'default', value: 0 },
    description: '코딩할 때 입는 후드티',
  },
  {
    id: 'outfit_suit',
    name: '정장',
    category: 'outfit',
    rarity: 'rare',
    spriteSheet: '/sprites/avatars/outfit/suit.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'level', value: 15 },
    description: '시니어의 품격',
  },
  // 악세서리
  {
    id: 'acc_glasses',
    name: '둥근 안경',
    category: 'accessory',
    rarity: 'common',
    spriteSheet: '/sprites/avatars/accessories/glasses.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'default', value: 0 },
    description: '지적인 느낌의 안경',
  },
  {
    id: 'acc_headphones',
    name: '헤드폰',
    category: 'accessory',
    rarity: 'uncommon',
    spriteSheet: '/sprites/avatars/accessories/headphones.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'achievement', value: 'first_task' },
    description: '집중 모드 ON',
  },
  {
    id: 'acc_coffee',
    name: '커피 머그',
    category: 'accessory',
    rarity: 'rare',
    spriteSheet: '/sprites/avatars/accessories/coffee.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'achievement', value: 'night_owl' },
    description: '개발자의 영혼의 동반자',
  },
  // 배경
  {
    id: 'bg_office',
    name: '사무실',
    category: 'background',
    rarity: 'common',
    spriteSheet: '/sprites/backgrounds/office.png',
    spritePosition: { x: 0, y: 0, width: 128, height: 128 },
    unlockCondition: { type: 'default', value: 0 },
    description: '깔끔한 사무실 환경',
  },
  {
    id: 'bg_home',
    name: '홈 오피스',
    category: 'background',
    rarity: 'common',
    spriteSheet: '/sprites/backgrounds/home.png',
    spritePosition: { x: 0, y: 0, width: 128, height: 128 },
    unlockCondition: { type: 'default', value: 0 },
    description: '편안한 재택근무 환경',
  },
  {
    id: 'bg_server',
    name: '서버룸',
    category: 'background',
    rarity: 'epic',
    spriteSheet: '/sprites/backgrounds/server.png',
    spritePosition: { x: 0, y: 0, width: 128, height: 128 },
    unlockCondition: { type: 'skill', value: 'devops_master' },
    description: 'DevOps 마스터의 성역',
  },
  // 이펙트
  {
    id: 'effect_sparkle',
    name: '반짝임',
    category: 'effect',
    rarity: 'rare',
    spriteSheet: '/sprites/avatars/effects/sparkle.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'level', value: 10 },
    description: '시니어의 아우라',
  },
  {
    id: 'effect_flame',
    name: '불꽃 오라',
    category: 'effect',
    rarity: 'epic',
    spriteSheet: '/sprites/avatars/effects/flame.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'achievement', value: 'streak_30' },
    description: '30일 연속 출석의 증거',
  },
  {
    id: 'effect_rainbow',
    name: '무지개 오라',
    category: 'effect',
    rarity: 'legendary',
    spriteSheet: '/sprites/avatars/effects/rainbow.png',
    spritePosition: { x: 0, y: 0, width: 32, height: 32 },
    unlockCondition: { type: 'level', value: 50 },
    description: '전설의 아키텍트',
  },
];

// 아이템 희귀도 색상
export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#9CA3AF',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};
