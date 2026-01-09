interface IXPBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export function XPBar({
  current,
  max,
  showLabel = true,
  size = 'md',
  showPercentage = false
}: IXPBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`xp-bar ${heights[size]}`}>
        <div
          className="xp-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mt-1">
          {showPercentage && (
            <span className="text-xs text-[#00d4ff] font-medium">
              {Math.round(percentage)}%
            </span>
          )}
          {showLabel && (
            <p className="text-xs text-[#8888aa] ml-auto">
              {current.toLocaleString()} / {max.toLocaleString()} XP
            </p>
          )}
        </div>
      )}
    </div>
  );
}
