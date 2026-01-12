import React from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollArea: React.FC<ScrollAreaProps> = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`overflow-auto rounded-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { ScrollArea };