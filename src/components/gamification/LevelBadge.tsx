import { useGameStore } from '../../stores';

interface ILevelBadgeProps {
  level?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTitle?: boolean;
}

export function LevelBadge({ level: propLevel, size = 'md', showTitle = false }: ILevelBadgeProps) {
  const { level: storeLevel, getCurrentLevelInfo } = useGameStore();
  const level = propLevel ?? storeLevel;
  const levelInfo = getCurrentLevelInfo();

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  const getGradient = (lvl: number) => {
    if (lvl >= 50) {
      return 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 25%, #6bcb77 50%, #4d96ff 75%, #a855f7 100%)';
    }
    if (lvl >= 40) {
      return 'linear-gradient(135deg, #ff6b6b 0%, #a855f7 100%)';
    }
    if (lvl >= 30) {
      return 'linear-gradient(135deg, #FFD700 0%, #FF6B00 100%)';
    }
    if (lvl >= 20) {
      return 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)';
    }
    if (lvl >= 10) {
      return 'linear-gradient(135deg, #C0C0C0 0%, #6b7280 100%)';
    }
    return 'linear-gradient(135deg, #CD7F32 0%, #92400e 100%)';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`level-badge font-pixel ${sizes[size]} shadow-lg`}
        style={{
          background: getGradient(level),
          boxShadow: level >= 20
            ? '0 0 20px rgba(0,212,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)'
            : '0 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        {level}
      </div>
      {showTitle && (
        <span className="text-sm gradient-text-gold font-medium text-center">
          {levelInfo.title}
        </span>
      )}
    </div>
  );
}
