import { useState } from 'react';
import { PixelBox } from '../components/common/PixelBox';
import { useGameStore } from '../stores';
import type { ISkill } from '../types';
import { DEFAULT_SKILL_TREE } from '../types';

export function Skills() {
  const [selectedBranch, setSelectedBranch] = useState('frontend');
  const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);
  const { skillPoints } = useGameStore();

  const branches = DEFAULT_SKILL_TREE.branches;
  const currentBranch = branches.find((b) => b.id === selectedBranch);

  const canUnlockSkill = (skill: ISkill) => {
    if (skill.currentLevel >= skill.maxLevel) return false;
    if (skill.cost > skillPoints) return false;
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title gradient-text mb-2">스킬트리</h1>
          <p className="text-[#8888aa] text-sm">스킬 포인트를 사용하여 능력을 강화하세요</p>
        </div>
        <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgba(168,85,247,0.3)] to-[rgba(255,217,61,0.3)] flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#a855f7]">{skillPoints}</p>
            <p className="text-xs text-[#8888aa]">스킬 포인트</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 브랜치 선택 */}
        <div className="col-span-12 md:col-span-2">
          <div className="flex md:flex-col gap-2">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => {
                  setSelectedBranch(branch.id);
                  setSelectedSkill(null);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  selectedBranch === branch.id
                    ? 'glass-card shadow-[0_0_20px_rgba(0,212,255,0.2)]'
                    : 'bg-[rgba(30,30,74,0.5)] hover:bg-[rgba(30,30,74,0.8)]'
                }`}
                style={{
                  borderColor: selectedBranch === branch.id ? branch.color : 'transparent',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                }}
              >
                <span className="text-2xl">{branch.icon}</span>
                <span className="text-sm hidden md:block">{branch.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 스킬트리 시각화 */}
        <div className="col-span-12 md:col-span-6">
          <PixelBox className="p-6 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                style={{ background: `linear-gradient(135deg, ${currentBranch?.color}33, ${currentBranch?.color}11)` }}
              >
                {currentBranch?.icon}
              </div>
              <h2
                className="font-pixel text-lg"
                style={{ color: currentBranch?.color }}
              >
                {currentBranch?.name}
              </h2>
            </div>

            {/* 스킬 노드들 */}
            <div className="grid grid-cols-3 gap-4">
              {currentBranch?.skills.map((skill) => {
                const isUnlocked = skill.currentLevel > 0;
                const canUnlock = canUnlockSkill(skill);
                const isSelected = selectedSkill?.id === skill.id;

                return (
                  <div
                    key={skill.id}
                    className={`relative ${
                      isUnlocked
                        ? ''
                        : canUnlock
                        ? 'animate-pulse-glow'
                        : 'opacity-40 grayscale'
                    }`}
                  >
                    <PixelBox
                      className={`p-4 text-center cursor-pointer transition-all duration-300 ${
                        isSelected ? 'ring-2 ring-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.3)]' : ''
                      } ${isUnlocked ? 'border-[#6bcb77]' : ''}`}
                      hover={!(!canUnlock && !isUnlocked)}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="relative">
                        <span className="text-4xl block mb-3">{skill.icon}</span>
                        {isUnlocked && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#6bcb77] flex items-center justify-center">
                            <span className="text-xs text-black">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{skill.name}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {Array.from({ length: skill.maxLevel }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < skill.currentLevel
                                ? 'bg-[#6bcb77]'
                                : 'bg-[rgba(90,90,154,0.3)]'
                            }`}
                          />
                        ))}
                      </div>
                    </PixelBox>
                  </div>
                );
              })}
            </div>
          </PixelBox>
        </div>

        {/* 스킬 상세 */}
        <div className="col-span-12 md:col-span-4">
          {selectedSkill ? (
            <PixelBox variant="gradient" className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-xl bg-[rgba(0,0,0,0.3)] flex items-center justify-center">
                  <span className="text-4xl">{selectedSkill.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedSkill.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-primary">Tier {selectedSkill.tier}</span>
                    <span className="text-sm text-[#8888aa]">
                      {selectedSkill.currentLevel}/{selectedSkill.maxLevel}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#e8e8ff] mb-5 leading-relaxed">{selectedSkill.description}</p>

              {/* 효과 */}
              <div className="mb-5">
                <p className="text-xs text-[#8888aa] mb-2 flex items-center gap-2">
                  <span className="text-[#6bcb77]">✦</span> 효과
                </p>
                <div className="space-y-2">
                  {selectedSkill.effects.map((effect, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[rgba(107,203,119,0.1)] border border-[rgba(107,203,119,0.2)]">
                      <p className="text-sm text-[#6bcb77]">{effect.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 비용 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(0,0,0,0.3)] mb-5">
                <span className="text-sm text-[#8888aa]">필요 SP</span>
                <span className="text-lg font-bold text-[#a855f7]">{selectedSkill.cost} SP</span>
              </div>

              {/* 선행 스킬 */}
              {selectedSkill.prerequisites.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-[#8888aa] mb-2 flex items-center gap-2">
                    <span className="text-[#ff6b6b]">⚡</span> 선행 스킬
                  </p>
                  {selectedSkill.prerequisites.map((preId) => {
                    const preSkill = currentBranch?.skills.find((s) => s.id === preId);
                    return (
                      <div key={preId} className="p-2 rounded-lg bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.2)]">
                        <p className="text-sm text-[#ff6b6b]">{preSkill?.name || preId}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 해금 버튼 */}
              <button
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                  canUnlockSkill(selectedSkill)
                    ? 'btn-primary'
                    : 'bg-[rgba(90,90,154,0.3)] text-[#8888aa] cursor-not-allowed'
                }`}
                disabled={!canUnlockSkill(selectedSkill)}
              >
                {selectedSkill.currentLevel >= selectedSkill.maxLevel
                  ? '✓ 최대 레벨'
                  : `스킬 해금 (${selectedSkill.cost} SP)`}
              </button>
            </PixelBox>
          ) : (
            <PixelBox className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[rgba(0,212,255,0.1)] flex items-center justify-center">
                <span className="text-4xl">🌳</span>
              </div>
              <p className="text-[#8888aa]">스킬을 선택하세요</p>
              <p className="text-xs text-[#666688] mt-2">왼쪽에서 스킬 노드를 클릭하면<br/>상세 정보를 볼 수 있습니다</p>
            </PixelBox>
          )}
        </div>
      </div>
    </div>
  );
}
