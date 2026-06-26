import React from 'react';

interface SectionLabelProps {
  number: string;
  label: string;
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div className="flex lg:flex-col lg:items-start items-center gap-3 lg:gap-4 text-xs font-mono tracking-widest text-textMuted uppercase select-none pb-4 lg:pb-0 lg:sticky lg:top-32 h-fit">
      <span className="text-accent font-bold">{number}</span>
      <span className="w-8 lg:w-[1px] lg:h-8 bg-border-custom" />
      <span className="writing-mode-vertical-rl transform rotate-0 lg:rotate-0 tracking-wider">
        {label}
      </span>
    </div>
  );
}
