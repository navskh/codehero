import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  IAvatar,
  IAvatarBase,
  AvatarAnimation,
  ItemCategory,
} from '../types';
import { DEFAULT_AVATAR_ITEMS } from '../types';

interface IAvatarStore {
  avatar: IAvatar;
  currentAnimation: AvatarAnimation;

  // Actions
  setBase: (base: Partial<IAvatarBase>) => void;
  equipItem: (category: ItemCategory, itemId: string) => void;
  unequipItem: (category: ItemCategory) => void;
  unlockItem: (itemId: string) => void;
  isItemUnlocked: (itemId: string) => boolean;
  setAnimation: (animation: AvatarAnimation) => void;
  getUnlockedItems: (category?: ItemCategory) => string[];
  reset: () => void;
}

const initialAvatar: IAvatar = {
  id: 'default',
  base: {
    skinTone: 0,
    eyeStyle: 0,
    eyeColor: 0,
  },
  equipment: {
    hair: 'hair_short_black',
    outfit: 'outfit_casual',
    accessory: null,
    background: 'bg_home',
    effect: null,
  },
  unlockedItems: [
    // 기본 아이템들
    'hair_short_black',
    'hair_messy',
    'outfit_casual',
    'outfit_hoodie',
    'acc_glasses',
    'bg_office',
    'bg_home',
  ],
  currentAnimation: 'idle',
};

export const useAvatarStore = create<IAvatarStore>()(
  persist(
    (set, get) => ({
      avatar: initialAvatar,
      currentAnimation: 'idle',

      setBase: (base) => {
        set((state) => ({
          avatar: {
            ...state.avatar,
            base: {
              ...state.avatar.base,
              ...base,
            },
          },
        }));
      },

      equipItem: (category, itemId) => {
        const state = get();

        // 아이템이 해금되어 있는지 확인
        if (!state.avatar.unlockedItems.includes(itemId)) {
          console.warn(`Item ${itemId} is not unlocked`);
          return;
        }

        set((state) => ({
          avatar: {
            ...state.avatar,
            equipment: {
              ...state.avatar.equipment,
              [category]: itemId,
            },
          },
        }));
      },

      unequipItem: (category) => {
        set((state) => ({
          avatar: {
            ...state.avatar,
            equipment: {
              ...state.avatar.equipment,
              [category]: null,
            },
          },
        }));
      },

      unlockItem: (itemId) => {
        const state = get();

        if (state.avatar.unlockedItems.includes(itemId)) {
          return; // 이미 해금됨
        }

        set((state) => ({
          avatar: {
            ...state.avatar,
            unlockedItems: [...state.avatar.unlockedItems, itemId],
          },
        }));
      },

      isItemUnlocked: (itemId) => {
        return get().avatar.unlockedItems.includes(itemId);
      },

      setAnimation: (animation) => {
        set({ currentAnimation: animation });
      },

      getUnlockedItems: (category) => {
        const state = get();
        const unlocked = state.avatar.unlockedItems;

        if (!category) {
          return unlocked;
        }

        return unlocked.filter((itemId) => {
          const item = DEFAULT_AVATAR_ITEMS.find((i) => i.id === itemId);
          return item?.category === category;
        });
      },

      reset: () => {
        set({ avatar: initialAvatar, currentAnimation: 'idle' });
      },
    }),
    {
      name: 'codehero-avatar',
    }
  )
);
