import { useState } from 'react';
import { PixelBox } from '../components/common/PixelBox';
import { useAvatarStore, useGameStore } from '../stores';
import type { ItemCategory } from '../types';
import { DEFAULT_AVATAR_ITEMS, RARITY_COLORS } from '../types';

const categories: { id: ItemCategory; label: string; icon: string }[] = [
  { id: 'hair', label: '헤어', icon: '💇' },
  { id: 'outfit', label: '의상', icon: '👕' },
  { id: 'accessory', label: '악세서리', icon: '🎀' },
  { id: 'background', label: '배경', icon: '🖼️' },
  { id: 'effect', label: '이펙트', icon: '✨' },
];

export function Avatar() {
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('hair');
  const { avatar, equipItem, unequipItem, isItemUnlocked } = useAvatarStore();
  const { level } = useGameStore();

  const categoryItems = DEFAULT_AVATAR_ITEMS.filter(
    (item) => item.category === activeCategory
  );

  const getUnlockStatus = (item: typeof DEFAULT_AVATAR_ITEMS[0]) => {
    if (isItemUnlocked(item.id)) return 'unlocked';
    if (item.unlockCondition.type === 'level' && level >= (item.unlockCondition.value as number)) {
      return 'available';
    }
    return 'locked';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-pixel text-2xl gradient-text mb-2">아바타</h1>
        <p className="text-[#8888aa] text-sm">캐릭터를 꾸미고 개성을 표현하세요</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 아바타 프리뷰 */}
        <div className="col-span-12 md:col-span-5">
          <PixelBox variant="gradient" className="p-6">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-[rgba(0,212,255,0.1)] to-[rgba(168,85,247,0.1)] border border-[rgba(90,90,154,0.3)] flex items-center justify-center mb-5">
              <div className="text-8xl pixelated animate-float">👨‍💻</div>
            </div>

            {/* 장착 아이템 표시 */}
            <div className="space-y-2">
              <p className="text-xs text-[#8888aa] mb-3 flex items-center gap-2">
                <span className="text-[#00d4ff]">♦</span> 장착 중인 아이템
              </p>
              {Object.entries(avatar.equipment).map(([cat, itemId]) => {
                if (!itemId) return null;
                const item = DEFAULT_AVATAR_ITEMS.find((i) => i.id === itemId);
                const category = categories.find((c) => c.id === cat);
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(90,90,154,0.2)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category?.icon}</span>
                      <span className="text-sm">{item?.name || itemId}</span>
                    </div>
                    <button
                      onClick={() => unequipItem(cat as ItemCategory)}
                      className="w-7 h-7 rounded-lg bg-[rgba(255,107,107,0.2)] text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.3)] transition-all flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {Object.values(avatar.equipment).every((v) => !v) && (
                <p className="text-center text-[#666688] py-4 text-sm">아직 장착한 아이템이 없습니다</p>
              )}
            </div>
          </PixelBox>
        </div>

        {/* 아이템 선택 */}
        <div className="col-span-12 md:col-span-7">
          {/* 카테고리 탭 */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-tab ${activeCategory === cat.id ? 'category-tab-active' : ''}`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* 아이템 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categoryItems.map((item) => {
              const status = getUnlockStatus(item);
              const isEquipped = avatar.equipment[activeCategory] === item.id;

              return (
                <PixelBox
                  key={item.id}
                  className={`p-4 relative ${
                    status === 'locked' ? 'opacity-50 grayscale' : ''
                  } ${isEquipped ? 'ring-2 ring-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.3)]' : ''}`}
                  hover={status !== 'locked'}
                  onClick={() => {
                    if (status === 'unlocked') {
                      if (isEquipped) {
                        unequipItem(activeCategory);
                      } else {
                        equipItem(activeCategory, item.id);
                      }
                    }
                  }}
                >
                  {/* 희귀도 표시 */}
                  <div
                    className="absolute top-3 right-3 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: RARITY_COLORS[item.rarity],
                      boxShadow: `0 0 10px ${RARITY_COLORS[item.rarity]}`,
                    }}
                  />

                  {/* 아이템 프리뷰 */}
                  <div className="aspect-square rounded-xl bg-[rgba(0,0,0,0.3)] mb-3 flex items-center justify-center text-4xl">
                    {item.category === 'hair' && '💇'}
                    {item.category === 'outfit' && '👕'}
                    {item.category === 'accessory' && '🎀'}
                    {item.category === 'background' && '🖼️'}
                    {item.category === 'effect' && '✨'}
                  </div>

                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-[#8888aa] truncate mt-1">{item.description}</p>

                  {/* 잠금 표시 */}
                  {status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] rounded-xl">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center">
                          <span className="text-2xl">🔒</span>
                        </div>
                        <p className="text-xs text-[#8888aa]">
                          {item.unlockCondition.type === 'level' &&
                            `Lv.${item.unlockCondition.value} 필요`}
                          {item.unlockCondition.type === 'achievement' && '업적 필요'}
                          {item.unlockCondition.type === 'skill' && '스킬 필요'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 장착 표시 */}
                  {isEquipped && (
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-primary">장착</span>
                    </div>
                  )}
                </PixelBox>
              );
            })}
          </div>

          {categoryItems.length === 0 && (
            <PixelBox className="p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(168,85,247,0.1)] flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-[#8888aa]">이 카테고리에 아이템이 없습니다</p>
            </PixelBox>
          )}
        </div>
      </div>
    </div>
  );
}
