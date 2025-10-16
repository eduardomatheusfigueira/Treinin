import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-10
  onProgressChange: (newProgress: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, onProgressChange }) => {
  return (
    <div className="flex items-center gap-2 w-full max-w-xs">
      {[...Array(10)].map((_, index) => {
        const level = index + 1;
        const isActive = level <= progress;
        return (
          <button
            key={level}
            onClick={() => onProgressChange(progress === level ? level - 1 : level)}
            className={`h-3 flex-1 rounded-sm transition-all duration-300 transform hover:scale-110 ${
              isActive ? 'bg-bone shadow-[0_0_8px_0] shadow-bone/40' : 'bg-onyx'
            }`}
            aria-label={`Definir progresso para ${level}`}
          />
        );
      })}
    </div>
  );
};

export default ProgressBar;