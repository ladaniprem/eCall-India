import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  progressBarWidth: string;
  progressBarColor: string;
  hoverColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  unit,
  progressBarWidth,
  progressBarColor,
  hoverColor,
}) => {
  return (
    <div className={`glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50 hover:${hoverColor}/50 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          {icon}
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${progressBarColor} tabular-nums`}>
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{unit}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: progressBarWidth }}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;