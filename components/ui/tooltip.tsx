import React from 'react';

interface TooltipProviderProps {
  children: React.ReactNode;
}

interface TooltipProps {
  children: React.ReactNode;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
}

interface TooltipContentProps {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <>{children}</>;
};

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

const TooltipContent: React.FC<TooltipContentProps> = ({ children, side = 'top' }) => {
  return <div className={`absolute z-50 bg-popover text-popover-foreground rounded-md shadow-lg p-2 ${side === 'top' ? 'bottom-full mb-2' : side === 'bottom' ? 'top-full mt-2' : side === 'left' ? 'right-full mr-2' : 'left-full ml-2'}`}>{children}</div>;
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };